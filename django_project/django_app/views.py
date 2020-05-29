# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from slacker import Slacker # Slack API
import json
import os
from bs4 import BeautifulSoup
import requests

#=======================================================
import pymongo # 몽고디비
from konlpy.tag import Okt # 토크나이져
import numpy as np # 벡터 연산을 위한 데이터 형식
from numpy import dot #벡터 연산
from numpy.linalg import norm #벡터 연산
import random # 대답 무작위 추출용

#토크나이져
def tokenize(message):
    t=Okt()
    all_words=t.nouns(message)
    return set(all_words)

#벡터 유사도 측정을 위한 코사인 유사도
def cos_sim(A, B): # -1 : 반대,  0 : 독립, 1 : 일치 
    return dot(A, B)/(norm(A)*norm(B))

# 디비 연결
client = pymongo.MongoClient("mongodb+srv://capstone:capstone@cluster0-b4lig.mongodb.net/test?retryWrites=true&w=majority") # 조일신 아틀라스
db = client.test
doc = db.chatbots.find()
uid = set()
for i in doc:
    uid = uid.union({i["userid"]})
Default_chatbotSet = set()
collection = db.TrainedData
chat_doc = collection.find()
for i in chat_doc:
    Default_chatbotSet = Default_chatbotSet.union({i["chatbotid"]})
for cur_uid in uid:
    chatbotSetCheck = set()
    chatbotSetCheck.clear()
    doc = db.chatbots.find({"userid": cur_uid})
    for i in doc:
        chatbotSetCheck = chatbotSetCheck.union({i["chatbotid"]})
    for bot in chatbotSetCheck:
        doc = db.chatbots.find({"userid": cur_uid, "chatbotid": bot})
        #중복 제거 intent 추출
        intents = list({intent["intent"] : intent for intent in doc}.values())
        #중복 제거 토크나이징 단어 추출
        Tokenized = set()
        doc = db.chatbots.find({"userid": cur_uid, "chatbotid": bot})
        for i in doc:
            x = tokenize(i["sentence"])
            Tokenized = Tokenized.union(x)
        IntentDict = {} # 완성용 2차원 dictionary
        WordDict= {} # 단어별 개수세는 dictionary

        # 각 value 0으로 초기화
        for i in Tokenized:
            WordDict[i] = 0   

        # 각 intent마다 딕셔너리 frame 복사
        for i in intents:
            IntentDict[i["intent"]] = WordDict.copy() 
        # 데이터 축적
        doc = db.chatbots.find({"userid": cur_uid, "chatbotid": bot})
        for i in doc:
            for j in tokenize(i["sentence"]):
                IntentDict[i["intent"]][j] +=1
        #=======================================================
        if bool(Default_chatbotSet.intersection({bot})):
            collection.update_one(
              {"userid" : cur_uid, "chatbotid" : bot}, 
              { "$set" : 
                { "userid" : cur_uid, "chatbotid" : bot, "Vector" : IntentDict, "intents" : intents, "WordDict" : WordDict}
              }
            )
        else:
            post ={ "userid" : cur_uid, "chatbotid" : bot, "Vector" : IntentDict, "intents" : intents, "WordDict" : WordDict}
            collection.insert_one(post)

    
token = 'xoxb-951760360900-983050911556-9Lc76gF0Yjbp8FSz64CqfrWJ'
slack = Slacker(token)

def attachTemplate(head, href, text, title, image, sub):
    domain = "https://post.naver.com/"
    return {
        "color": "#36a64f",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": head+" 개 포스트를 찾았습니다."
                },
                "accessory": {
                    "type": "overflow",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": True
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": True
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`"+sub[0]+"`\n"+"*<"+domain+href[0]+"|"+title[0]+">*\n"+text[0]
                },
                "accessory": {
                    "type": "image",
                    "image_url": image[0],
                    "alt_text": text[0]
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`"+sub[1]+"`\n"+"*<"+domain+href[1]+"|"+title[1]+">*\n"+text[1]
                },
                "accessory": {
                    "type": "image",
                    "image_url": image[1],
                    "alt_text": text[1]
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`"+sub[2]+"`\n"+"*<"+domain+href[2]+"|"+title[2]+">*\n"+text[2]
                },
                "accessory": {
                    "type": "image",
                    "image_url": image[2],
                    "alt_text": text[2]
                }
            }
        ]
    }

def crawler(keyword):
    print(keyword)
    url = 'https://post.naver.com/search/post.nhn?keyword='+keyword
    req = requests.get(url)
    html = req.text
    soup = BeautifulSoup(html, 'html.parser')
    
    head = soup.select(
        '#cont > div > div.sorting_area.t2 > div > span > em'
    )[0]
    
    head = str(head).replace('<em>', '*')
    head = head.replace('</em>', '*')
    
    href = []
    text = []
    title = []
    image = []
    sub = []
    
    for i in range(3):
        ullist = soup.select(
            'body #wrap #cont > div #_list_container #el_list_container > ul > li:nth-of-type('+str(i+1)+')  div > div.feed_body > div.text_area > a.link_end'
        )[0]

        href.append(str(ullist.get('href')))

        ullist = soup.select(
            'body #wrap #cont > div #_list_container #el_list_container > ul > li:nth-of-type(' + str(
            i + 1) + ')  div > div.feed_body > div.text_area > a.link_end > p'
        )[0]
        ullist = str(ullist).replace('<p class="text_feed ell">','')
        ullist = ullist.replace('</p>','')
        ullist = ullist.replace('<em>','*')
        ullist = ullist.replace('</em>','* ')
        text.append(ullist)
        
        ullist = soup.select(
            'body #wrap #cont > div #_list_container #el_list_container > ul > li:nth-of-type(' + str(
                i + 1) + ')  div > div.feed_body > div.image_area > a'
        )[0]
        
        ullist = soup.select(
            'body #wrap #cont > div #_list_container #el_list_container > ul > li:nth-of-type(' + str(
                i + 1) + ')  div > div.feed_body > div.text_area > a.link_end > strong'
        )[0]

        ullist = str(ullist.text).strip()
        title.append(ullist)
        
        ullist = soup.select(
            'body #wrap #cont > div #_list_container #el_list_container > ul > li:nth-of-type(' + str(
                i + 1) + ')  div > div.feed_body > div.image_area > a > img'
        )[0]
        
        ullist = str(ullist.get('data-src'))
        image.append(ullist)
        
        ullist = soup.select(
            'body #wrap #cont > div #_list_container #el_list_container > ul > li:nth-of-type(' + str(
                i + 1) + ')  div > div.feed_body > div.text_area > a.series_title > div'
        )[0]
        
        ullist = ullist.getText()
        ullist = ullist.split(' ')
        
        tmpstr = ""
        for i in range(1,len(ullist)):
            tmpstr += ullist[i]+" "
        sub.append(tmpstr.strip())
    
        
    return attachTemplate(head, href, text, title, image, sub)


userid = []
userchecked = 0
chatbotchecked = 0
cur_uid = ''
cur_bid = ''
ChatbotSet = set()
VectorDict={}

def app_mention(json_data):
    global userchecked
    global chatbotchecked
    global cur_uid
    global cur_bid
    global ChatbotSet
    global VectorDict
    #호출한채널
    channel = json_data['event']['channel']
    #유저 메세지
    rcvmsg = json_data['event']['text']
    
    tmpuid = rcvmsg.split(' ')
    if not userchecked:
        ChatbotSet.clear()
        doc = db.chatbots.find({"userid" : tmpuid[1]})
        for i in doc:
            tmp = {i['chatbotid']}
            ChatbotSet = ChatbotSet.union(tmp)
        if not bool(ChatbotSet):
            slack.chat.post_message(channel, '존재하지 않는 ID입니다. 다시 입력해 주십시오')
        else:
            slack.chat.post_message(channel, '확인되었습니다. 어떤 chatbot을 이용하실 건가요?')
            userchecked = 1
            cur_uid = tmpuid[1]
            slack.chat.post_message(channel, cur_uid+'님의 chatbot 목록')
            for i in ChatbotSet:
                slack.chat.post_message(channel,'  - '+ i)
    elif userchecked and not chatbotchecked:
        doc = db.chatbots.find({"userid" : cur_uid})
        for i in doc:
            if tmpuid[1] == i['chatbotid']:
                cur_bid = tmpuid[1]
                chatbotchecked = 1
                break
        if chatbotchecked:
            slack.chat.post_message(channel, '확인되었습니다.'+cur_uid+'님의 '+cur_bid+'로 접속합니다.')
            slack.chat.post_message(channel, '데이터 로딩중')
            #==============================================
            
            #학습된 데이터 가져오기
            trained_doc = db.TrainedData.find_one({"userid" : cur_uid, "chatbotid" : cur_bid})

            #코사인으로 유사성 측정을 위해 벡터형식으로 전환
            VectorDict.clear()
            for key, value in trained_doc["Vector"].items():
                frame = []
                for ky, val in value.items():
                    frame.append(val)
                VectorDict[key] = np.array(frame)
            global NoneDuplica_intents
            global WordFrame
            NoneDuplica_intents = trained_doc["intents"]
            WordFrame = trained_doc["WordDict"]
            slack.chat.post_message(channel,'로딩완료, 무엇이 궁금하신가요?')
            
        else:
            slack.chat.post_message(channel, '존재하지 않는 Chatbot입니다. 다시 입력해 주십시오')
            slack.chat.post_message(channel, cur_uid+'님의 chatbot 목록')
            for i in ChatbotSet:
                slack.chat.post_message(channel,'  - '+ i)
    elif userchecked and chatbotchecked:
        input = tmpuid[1]
        
        if input == "로그아웃":
            slack.chat.post_message(channel, cur_bid+'를 종료합니다. 안녕히 가세요 '+cur_uid+'님')
            userchecked = 0
            chatbotchecked = 0
            cur_uid = ''
            cur_bid = ''
            slack.chat.post_message(channel,'다시 이용하시려면 ID를 입력해 주세요')
        else:
            InputDict = WordFrame.copy()
            for i in tokenize(input):
                try:
                    InputDict[i]+=1
                except:
                    pass
            InputVector = []
            for ky, val in InputDict.items():
                InputVector.append(val)

            MaxProb = -2

            #벡터 유사도 검사
            for i in NoneDuplica_intents:
                similarity = cos_sim(VectorDict[i['intent']], InputVector)
                #print(i['intent'], similarity)
                if similarity > MaxProb:
                    MaxProb = similarity
                    SelectedIntent = i['intent']

            AnswerList = []

            doc = db.chatbots.find({"entity" : "answer"})
            try:
                for i in doc:
                    if i['intent'] == SelectedIntent :
                        AnswerList.append(i['sentence'])
                wrSelectedIntent = SelectedIntent.replace(" ","+")
            except:
                pass




            if MaxProb < -0.5:
                slack.chat.post_message(channel, '미안해요 잘 모르겠습니다. 다른 궁금한 것은 없으신가요?')
            elif not AnswerList:
                attachments = [crawler(wrSelectedIntent)]
                url = 'https://search.naver.com/search.naver?query='+wrSelectedIntent
                slack.chat.post_message(channel, SelectedIntent+'을 원하시는군요\n'+
                                        url + '\n',
                                        attachments=attachments)
            else:
                selected = random.choice(AnswerList).replace(" ","+")
                attachments = [crawler(selected)]
                url = 'https://search.naver.com/search.naver?query='+selected
                slack.chat.post_message(channel, SelectedIntent+'을 원하시는군요 그렇다면 저는 '+selected.replace("+"," ")+'를 추천드릴게요 \n'+
                                        url + '\n',
                                        attachments=attachments)
    


    

    # echo
    #slack.chat.post_message(channel, rcvmsg)

    #=======================================================
    #=======================================================
    #input 문장 토크나이즈
        

def event_handler(json_data):
    etype = json_data['event']['type']
    print(etype)
    if etype == 'app_mention':
        app_mention(json_data)

progress = []

@csrf_exempt
def slackevent(request):
    #json 데이터 받음
    json_data = json.load(request)
    channel = json_data['event']['channel']
    #challenge verifying
    if 'challenge' in json_data:
        print(json_data['challenge'])
        return HttpResponse(json_data['challenge'])
    #유저가 @chatbot으로 호출했을 때
    if 'event' in json_data:
        print(json_data['event'])
        if(json_data['event']['client_msg_id'] not in progress):
            progress.append(json_data['event']['client_msg_id'])
            event_handler(json_data)
        return HttpResponse('')
    else:
        slack.chat.post_message(channel, '잘 모르겠습니다.')
        return HttpResponse('')
