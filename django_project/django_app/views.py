# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from slacker import Slacker # Slack API
import json
import os
from bs4 import BeautifulSoup
import requests
from . import crawler

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
    all_words=t.morphs(message)
    return set(all_words)

#벡터 유사도 측정을 위한 코사인 유사도
def cos_sim(A, B): # -1 : 반대,  0 : 독립, 1 : 일치 
    return dot(A, B)/(norm(A)*norm(B))

def web_request(method_name, url, dict_data, is_urlencoded=True):
    """Web GET or POST request를 호출 후 그 결과를 dict형으로 반환 """
    method_name = method_name.upper() # 메소드이름을 대문자로 바꾼다 
    if method_name not in ('GET', 'POST'):
        raise Exception('method_name is GET or POST plz...')
        
    if method_name == 'GET': # GET방식인 경우
        response = requests.get(url=url, params=dict_data)
    elif method_name == 'POST': # POST방식인 경우
        if is_urlencoded is True:
            response = requests.post(url=url, data=dict_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
        else:
            response = requests.post(url=url, data=json.dumps(dict_data), headers={'Content-Type': 'application/json'})
    
    dict_meta = {'status_code':response.status_code, 'ok':response.ok, 'encoding':response.encoding, 'Content-Type': response.headers['Content-Type']}
    if 'json' in str(response.headers['Content-Type']): # JSON 형태인 경우
        return {**dict_meta, **response.json()}
    else: # 문자열 형태인 경우
        return {**dict_meta, **{'text':response.text}}

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

    
token = 'xoxb-951760360900-983050911556-1TZzXI9OX2utzpr6PKylwMZZ'
slack = Slacker(token)

userchecked = 0
chatbotchecked = 0
cur_uid = ''
cur_bid = ''
ChatbotSet = set()
VectorDict={}

def url_supporter(domain):
    if domain == 'Naver':
        return 'https://search.naver.com/search.naver?query='
    else:
        return 'https://www.youtube.com/results?search_query='

def app_mention(channel, rcvmsg, domain='Nothing', responseurl='Nothing', action=False, SelectedIntent=''):
    global userchecked
    global chatbotchecked
    global cur_uid
    global cur_bid
    global ChatbotSet
    global VectorDict
    
    if not action:
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
                    attachments = [crawler.naver_crawler(wrSelectedIntent)]
                    url = 'https://search.naver.com/search.naver?query='+wrSelectedIntent
                    slack.chat.post_message(channel, '*'+SelectedIntent+'* 을 원하시는군요 :thinking_face:\n'+
                                            url + '\n',
                                            attachments=attachments)

                else:
                    selected = random.choice(AnswerList).replace(" ","+")
                    attachments = [crawler.naver_crawler(selected)]
                    url = 'https://search.naver.com/search.naver?query='+selected
                    slack.chat.post_message(channel, '*'+SelectedIntent+'* 을 원하시는군요 :thinking_face: 그렇다면 저는 *'+selected.replace("+"," ")+'* :point_left: 를 추천드릴게요 \n'+
                                            url + '\n',
                                            attachments=attachments)
                attachments =[
                    {
                        "blocks": [
                            {
                                "type": "section",
                                "text": {
                                    "type": "plain_text",
                                    "text": "답변에 만족하셨나요? :wink: 정확도 향상에 도움이 됩니다!\n",
                                    "emoji": True
                                }
                            },
                            {
                                "type": "actions",
                                "elements": [
                                    {
                                        "type": "button",
                                        "text": {
                                            "type": "plain_text",
                                            "emoji": True,
                                            "text": "네"
                                        },
                                        "style": "primary",
                                        "value": "Yes"
                                    },
                                    {
                                        "type": "button",
                                        "text": {
                                            "type": "plain_text",
                                            "emoji": True,
                                            "text": "아니요"
                                        },
                                        "style": "danger",
                                        "value": "No"
                                    }
                                ]
                            }
                        ]
                    }
                ]
                slack.chat.post_message(channel, attachments=attachments)
    else:
        wrSelectedIntent = SelectedIntent.replace(" ","+")
        attachments = [crawler.crawler_handler(wrSelectedIntent, domain)]
        url = url_supporter(domain)+wrSelectedIntent
        data = {
            'text' : rcvmsg.split('<')[0].replace('\n','') + '\n' + url,
            'attachments' : attachments
        }
        web_request('POST', responseurl, data, is_urlencoded=False)


def event_handler(jsonData):
    if 'event' in jsonData:
        etype = jsonData['event']['type']
        print()
        print(etype)
        print()
        if etype == 'app_mention':
            app_mention(jsonData['event']['channel'], jsonData['event']['text'])
    if 'type' in jsonData:
        etype = jsonData['type']
        if etype == 'block_actions':
            print()
            print(jsonData)
            print()
            if jsonData['actions'][0]['type'] == 'button':
                data = {
                    "replace_original": "true",
                    'text' :  ':heavy_check_mark: 소중한 의견 감사합니다! '
                }
                web_request('POST', jsonData['response_url'], data, is_urlencoded=False)
            else:
                url = jsonData['response_url']
                text = jsonData['message']['text']
                app_mention(jsonData, text, jsonData['actions'][0]['selected_option']['value'], url, True, jsonData['message']['attachments'][0]['blocks'][0]['text']['text'].split(':')[0].replace('+',' '))

progress_msg = []
progress_action = []

@csrf_exempt
def slackevent(request):
    #json 데이터 받음
    if 'payload' in request.POST:
        jsonData = json.loads(request.POST.getlist('payload')[0])
    else:
        jsonData = json.load(request)
    #challenge verifying
    if 'challenge' in jsonData:
        return HttpResponse(jsonData['challenge'])
    #유저가 @chatbot으로 호출했을 때
    elif 'type' in jsonData:
        if 'event' in jsonData:
            if(jsonData['event']['client_msg_id'] not in progress_msg):
                print(jsonData)
                progress_msg.append(jsonData['event']['client_msg_id'])
                event_handler(jsonData)
        elif 'actions' in jsonData:
            if(jsonData['actions'][0]['action_id'] not in progress_action):
                progress_action.append(jsonData['actions'][0]['action_id'])
                event_handler(jsonData)
        return HttpResponse('')
    else:
        slack.chat.post_message(jsonData['event']['channel'], '잘 모르겠습니다.')
        return HttpResponse('')
