# hangman-javasript
a automatic paly hangman game

1. ##环境搭建##
  ```
    sudo npm install gulp typescript typings -g
    sudo npm install
    typings install
  ```
2. ##在开发模式启动##

  ```
    gulp serve.dev
  ```
3. ##打包##


  ```
    gulp build.prod
  ```
  
# 关于hangman游戏介绍

### 这是一个猜字游戏，游戏两方，甲方和乙方，甲方出一个固定长度的单词，乙方猜其中的字母，猜中则画出该字母，猜错则画一笔小人。直达画完一个上吊的小人，游戏结束

### 此项目为自动与机器人完hangman游戏，算法核心思想：先列出一组高频字母a,e,i,o等等元音字母。从字典当中的单词根据26字母顺序进行hash分组。机器人自动猜一字母，猜对则存入猜对池，猜错则将所有可能单词组将与该字母相关的单词筛除。
