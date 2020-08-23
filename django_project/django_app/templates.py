def naver_template(head, href, text, title, image, sub, keyword):
    return {
        "color": "#36a64f",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": keyword+":nod: \n :naver: 에서 "+head+" 개 관련 포스트를 찾았습니다."
                },
                "accessory": {
                    "type": "overflow",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": ":naver: Naver",
                                "emoji": True
                            },
                            "value": "Naver"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": ":youtube: Youtube",
                                "emoji": True
                            },
                            "value": "Youtube"
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
                    "text": "*<"+href[0]+"|"+title[0]+">*\n"+sub[0]+"\n"+text[0]
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
                    "text": "*<"+href[1]+"|"+title[1]+">*\n"+sub[1]+"\n"+text[1]
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
                    "text": "*<"+href[2]+"|"+title[2]+">*\n"+sub[2]+"\n"+text[2]
                },
                "accessory": {
                    "type": "image",
                    "image_url": image[2],
                    "alt_text": text[2]
                }
            }
        ]
    }


def youtube_template(head, href, text, title, image, sub, keyword):
    return {
        "color": "#D81414",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": keyword+":nod: \n :youtube: 에서 "+head+" 개 관련 동영상을 찾았습니다."
                },
                "accessory": {
                    "type": "overflow",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": ":naver: Naver",
                                "emoji": True
                            },
                            "value": "Naver"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": ":youtube: Youtube",
                                "emoji": True
                            },
                            "value": "Youtube"
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
                    "text": "*<"+href[0]+"|"+title[0]+">*\n"+sub[0]+"\n"+text[0]
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
                    "text": "*<"+href[1]+"|"+title[1]+">*\n"+sub[1]+"\n"+text[1]
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
                    "text": "*<"+href[2]+"|"+title[2]+">*\n"+sub[2]+"\n"+text[2]
                },
                "accessory": {
                    "type": "image",
                    "image_url": image[2],
                    "alt_text": text[2]
                }
            }
        ]
    }