from __future__ import division
from collections import Counter, defaultdict
#from machine_learning import split_data
from sklearn.model_selection import train_test_split
import math, random, re, glob
import pandas as pd
from konlpy.tag import Twitter 
# KoNLPy Korean NLP Python https://konlpy-ko.readthedocs.io/ko/v0.4.3/
#import csv

# 단어 단위로 잘라주는 함수 (# konlpy 사용하는 것으로 변경)
def tokenize(message):
    #message = message.lower()
    #all_words = re.findall("[a-z0-9']+", message)
    t=Twitter()
    #all_words=t.morphs(message)
    all_words=t.nouns(message)
    return set(all_words)

# 단어별 빈도수를 세어는 함수  [스팸여부, 메시지 내용] # 1 : adult, 2: ETC,  3 : gambling  4 : internet 5 :loan # 0 : hams
def count_words(training_set):
    counts = defaultdict(lambda: [0,0,0,0,0,0])
    training_set_arr = training_set.values
    for is_spam, message in training_set_arr:
        for word in tokenize(message):
            #counts[word][0 if is_spam else 1]+= 1
            counts[word][int(is_spam)]+= 1
   # print(counts)
    return counts #'weekends': [1, 1],[스팸에서 나온 빈도,햄에서 나온빈도]

# 빈도수를 통해 확률값 추정() ㅣlist 형식
#1 : adult, 2: ETC,  3 : gambling  4 : internet 5 :loan # 0 : hams
def word_probabilities(counts,  total_non_spams, total_adultSpams, total_etcSpams, total_gamblingSpams, total_internetSpams, total_loanSpams, k=0.5):
    return [(w,
             (non_spam + k) / (total_non_spams + 2 * k),
             (adultSpam + k) / (total_adultSpams + 2 * k),
              (etcSpam + k) / (total_etcSpams + 2 * k),
              (gamblingSpam + k) / (total_gamblingSpams + 2 * k),
              (intersSpam + k) / (total_internetSpams + 2 * k),
              (loanSpam + k) / (total_loanSpams + 2 * k))
              for w, (non_spam,adultSpam,etcSpam,gamblingSpam,intersSpam,loanSpam) in counts.items()]

##1 : adult, 2: ETC,  3 : gambling  4 : internet 5 :loan # 0 : hams
def spam_probability(word_probs, message):
    message_words = tokenize(message)
    log_prob_if_adultSpam = log_prob_if_not_spam = 0.0
    log_prob_if_etcSpam = log_prob_if_gamblingSpam = log_prob_if_internetSpam = log_prob_if_loanSpam = 0.0
    # print(word_probs)
    # print(message_words)
    for word, prob_if_not_spam, prob_if_adultSpam, prob_if_etcSpam, prob_if_gamblingSpam, prob_if_internetSpam, prob_if_loanSpam in word_probs:
        # print(word,'  ', prob_if_not_spam)
        if word in message_words:
            log_prob_if_adultSpam += math.log(prob_if_adultSpam)
            log_prob_if_etcSpam += math.log(prob_if_etcSpam)
            log_prob_if_gamblingSpam += math.log(prob_if_gamblingSpam)
            log_prob_if_internetSpam += math.log(prob_if_internetSpam)
            log_prob_if_loanSpam += math.log(prob_if_loanSpam)
            log_prob_if_not_spam += math.log(prob_if_not_spam)
        else:
            log_prob_if_adultSpam += math.log(1.0 - prob_if_adultSpam)
            log_prob_if_etcSpam += math.log(1.0 - prob_if_etcSpam)
            log_prob_if_gamblingSpam += math.log(1.0 - prob_if_gamblingSpam)
            log_prob_if_internetSpam += math.log(1.0 - prob_if_internetSpam)
            log_prob_if_loanSpam += math.log(1.0 - prob_if_loanSpam)
            log_prob_if_not_spam += math.log(1.0 - prob_if_not_spam)

    prob_if_adultSpam = math.exp(log_prob_if_adultSpam)
    prob_if_etcSpam = math.exp(log_prob_if_etcSpam)
    prob_if_gamblingSpam = math.exp(log_prob_if_gamblingSpam)
    prob_if_internetSpam = math.exp(log_prob_if_internetSpam)
    prob_if_loanSpam = math.exp(log_prob_if_loanSpam)
    prob_if_not_spam = math.exp(log_prob_if_not_spam)

    max_Proba = 0
    index_Proba = ''
    if max_Proba < (prob_if_loanSpam / (prob_if_loanSpam + prob_if_not_spam)):
        max_Proba = prob_if_loanSpam / (prob_if_loanSpam + prob_if_not_spam)
        index_Proba = 'loan'
    if max_Proba < (prob_if_adultSpam / (prob_if_adultSpam + prob_if_not_spam)):
        max_Proba = prob_if_adultSpam / (prob_if_adultSpam + prob_if_not_spam)
        index_Proba = 'adult'
    if max_Proba < (prob_if_etcSpam / (prob_if_etcSpam + prob_if_not_spam)):
        max_Proba = prob_if_etcSpam / (prob_if_etcSpam + prob_if_not_spam)
        index_Proba = 'etc'
    if max_Proba < (prob_if_gamblingSpam / (prob_if_gamblingSpam + prob_if_not_spam)):
        maxProba = prob_if_gamblingSpam / (prob_if_gamblingSpam + prob_if_not_spam)
        index_Proba = 'gambling'
    if max_Proba < (prob_if_internetSpam / (prob_if_internetSpam + prob_if_not_spam)):
        max_Proba = (prob_if_internetSpam / (prob_if_internetSpam + prob_if_not_spam))
        index_Proba = 'internet'

    # print(max_Proba,"//",index_Proba)

    # return prob_if_spam  / (prob_if_spam + prob_if_not_spam)
    return max_Proba, index_Proba  # 제일 높은 확률과 카테고리


# 나이브 베이지안 클래스에 넣기
class NaiveBayesClassifier:
    def __init__(self, k=0.5):
        self.k = k
        self.word_probs = []

    def classify(self, message):
        return spam_probability(self.word_probs, message)

    def train(self, training_set):
        # 스팸 메시지와 햄인 메시지의 갯수 세기
        num_non_spams = len(training_set[training_set.is_spam == '0'])
        num_adultSpams = len(training_set[training_set.is_spam == '1'])
        num_etcSpams = len(training_set[training_set.is_spam == '2'])
        num_gamblingSpams = len(training_set[training_set.is_spam == '3'])
        num_internetSpams = len(training_set[training_set.is_spam == '4'])
        num_loanSpams = len(training_set[training_set.is_spam == '5'])

        #print("num_adultSpams: ", num_adultSpams)
        #print("num_etcSpams: ", num_etcSpams)
        #print("num_gamblingSpams: ", num_gamblingSpams)
        #print("num_internetSpams: ", num_internetSpams)
        #print("num_loanSpams: ", num_loanSpams)
        #print("num_non_spams: ", num_non_spams)

        # 학습 데이터 적용하여 모델 만들기
        word_counts = count_words(training_set)
        self.word_probs = word_probabilities(word_counts, num_non_spams, num_adultSpams, num_etcSpams,
                                             num_gamblingSpams, num_internetSpams, num_loanSpams, self.k)
        # print(self.word_probs)



def p_spam_given_word(word_prob):
    word, prob_if_spam, prob_if_not_spam = word_prob
    return prob_if_spam / (prob_if_spam + prob_if_not_spam)


def train_and_test_model(data, sw, predicMess=''):
    if sw == '0':
        # 학습
        random.seed(0)
        # train_data, test_data = split_data(data,0.75)
        train_data, test_data = train_test_split(data, test_size=0.25)
        print("train_data_cnt:", len(train_data))
        print("test_data_cnt:", len(test_data))
        # print(test_data)

        classifier = NaiveBayesClassifier()
        classifier.train(train_data)

        test_data_arr = test_data.values
        classified = [(is_spam, message, classifier.classify(message)) for is_spam, message in test_data_arr]
        print(classified)
        #####counts = Counter((is_spam, spam_probability[1] > 0.5) for _, is_spam, spam_probability in classified)

        # print(counts)

        #####classified.sort(key=lambda row: row[2])
    # 스팸아닌데 스펨일 확률이 높은 메시지
    #####spammiest_hams = list(filter(lambda row: not row[0], classified))[-5:]
    # 스펨인데 스팸일 확률이 가장 낮은 메시지
    #####hammiest_spams = list(filter(lambda row: row[0], classified))[:5]

    #####print("spammiest_hams",spammiest_hams)
    #####print("Hammiest_spams",hammiest_spams)

    # words = sorted(classifier.word_probs, key = p_spam_given_word)

    # spammiest_words = words[-40:]
    # hammiest_words = words[:40]

    else:
        # 예측
        random.seed(0)
        # train_data, test_data = split_data(data,0.75)
        train_data, test_data = train_test_split(data, test_size=0)
        # print("train_data_cnt:",len(train_data))
        # print("test_data_cnt:",len(test_data))
        # print(test_data)

        classifier = NaiveBayesClassifier()
        classifier.train(train_data)
        spam_probability = classifier.classify(predicMess)
        print(spam_probability)
        print(spam_probability[0])

        if spam_probability[0] > 0.5:
            category = ''
            if spam_probability[1] == "adult":
                category = '성인물'
            elif spam_probability[1] == 'etc':
                category = '기타'
            elif spam_probability[1] == 'gambling':
                category = '게임'
            elif spam_probability[1] == 'internet':
                category = '인터넷유도'
            elif spam_probability[1] == 'loan':
                category = "대출"
            print(category, " 스팸 메시지 입니다.  ", spam_probability[0])
        else:
            print("스팸메시지가 아닙니다 .  ", spam_probability[0])

def nlpKoSpamStart(predicMessage, mode):
    #mode = '1' # 0: modeling 1 : prediction
    readData = pd.read_csv('C:/Django/workspace/python_bigdata/resource/trainning_csv/result_Category.csv',encoding='utf-8')
    trainData = readData.loc[:,['is_spam','message']]
    #predicMessage ="후끈후끈한 오늘 밤 룸서비스"
    #predicMessage = "?특가이벤트 술 여대생호텔비전부포함 32만 발렌타인 이정재CEO 거부0808503049"
    #predicMessage = "?광고운전도우미 원하시는요금으로 재빠르고안전하게 전화주세용"
    #predicMessage = "?Q 카지노 초대 이제 경비들이고 정선 마카오 가시지마세요 대박 출금"
    #predicMessage = "?기가기가인터넷신규가입 변경시현금40만원 광랜070전화 IPTV3개월무료"
    #predicMessage = "?신한저축은행입니다 고객님 은 최저금리로 1000만원 당일 송금 가능한 고객이십니다"
    # 1 : adult, 2: ETC,  3 : gambling  4 : internet 5 :loan # 0 : hams
    train_and_test_model(trainData, mode, predicMessage)
