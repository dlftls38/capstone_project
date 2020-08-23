import requests
from bs4 import BeautifulSoup
from . import templates
import json


def crawler_handler(keyword, domain):
    if domain == 'Naver':
        return naver_crawler(keyword)
    else:
        return youtube_crawler(keyword)


def naver_crawler(keyword):
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
            'body #wrap #cont > div #_list_container #el_list_container > ul > li:nth-of-type('+str(
                i+1)+')  div > div.feed_body > div.text_area > a.link_end'
        )[0]

        href.append("https://post.naver.com"+str(ullist.get('href')))

        ullist = soup.select(
            'body #wrap #cont > div #_list_container #el_list_container > ul > li:nth-of-type(' + str(
            i + 1) + ')  div > div.feed_body > div.text_area > a.link_end > p'
        )[0]
        ullist = str(ullist).replace('<p class="text_feed ell">','')
        ullist = ullist.replace('</p>','')
        ullist = ullist.replace('<em>',' *')
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
        )
        tmpstr = ""
        if len(ullist) > 0:
            tmpstr = "`"
            ullist = ullist[0]
            ullist = ullist.getText()
            ullist = ullist.split(' ')
            for i in range(1,len(ullist)):
                tmpstr += ullist[i]+" "
            tmpstr = tmpstr.strip()
            tmpstr += "`"
        sub.append(tmpstr)
    
        
    return templates.naver_template(head, href, text, title, image, sub, keyword.replace('+', ' '))

def youtube_crawler(keyword):
    url = "https://www.googleapis.com/youtube/v3/search?"
    params={
        "q":keyword,
        "part":"snippet",
        "key":"AIzaSyAt1XsLiJ8uKM8MYV0PzhlJ-WyprFcTa3A",
    }
    req = requests.get(url,params=params)
    html = req.text
    jsonData = json.loads(html)
    head = '*'+str(jsonData['pageInfo']['totalResults'])+'*'
    href = []
    text = []
    image = []
    title = []
    sub = []
    jsonData = jsonData['items']
    cnt = 0
    
    for i in range(20):
        cur_video = jsonData[i]
        if cur_video['id']['kind'] != 'youtube#video':
            continue
        cnt = cnt+1
        image.append(cur_video['snippet']['thumbnails']['default']['url'])
        title.append(cur_video['snippet']['title'])
        text.append(cur_video['snippet']['description'])
        sub.append('`'+cur_video['snippet']['channelTitle']+'`')
        href.append('https://www.youtube.com/watch?v='+cur_video['id']['videoId'])
        if cnt == 3:
            break
    
    return templates.youtube_template(head, href, text, title, image, sub, keyword.replace('+', ' '))