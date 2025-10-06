## Essentials of GitHub Actions learning pathway demo repository

This repository contains the core web application files and configuration you'll need to follow along through the [Essentials of automated application deployment with GitHub Actions & GitHub Pages](https://resources.github.com/learn/pathways/essentials/automated-application-deployment-with-github-actions-and-pages) module.

To follow along with the step-by-step instructions in the Essentials module, you will need to create a copy of this repository by doing the following:
1. Click **Use this template** above the file list and select **Create a new repository**.
2. Use the **Owner** dropdown menu to select the account you want to own the repository. 
3. Name your repository `actions-learning-pathway` and add a simple description to make it easier to identify later.
4. Set the default visibility for the repo to public, as private repositories use Actions minutes, while public repositories can use GitHub-hosted runners for free.

Click Create repository from template and we’re ready to build our first Actions workflow!



If you have arrived here from the [Intermediate automation strategies with GitHub Actions](https://resources.github.com/learn/pathways/automation/intermediate/workflow-automation-with-github-actions/) module without following the first module, copy the contents of the `/demo-files` folder into the `.github/workflows` folder to follow along.

## Playing the Tetris demo

This repository now ships with a 完整的交互式俄罗斯方块小游戏示例。要在本地体验：

1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可在首页直接游玩。

游戏支持键盘操作（方向键移动与旋转、空格硬降、P 暂停、R 重开），也可以使用侧边的按钮来暂停或重新开始。
