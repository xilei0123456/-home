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
3. 保持命令行窗口运行状态，然后在浏览器打开 [http://localhost:3000](http://localhost:3000) 即可在首页直接游玩。

如果你想验证打包后的静态版本，可以先执行 `npm run build`，随后运行 `npm run preview` 启动一个轻量的本地静态文件服务（默认同样监听在 `http://localhost:3000`）。

游戏支持键盘操作（方向键移动与旋转、空格硬降、P 暂停、R 重开），也可以使用侧边的按钮来暂停或重新开始。

## 文件是否已经在 GitHub 上？

当前你看到的所有项目文件都位于本地开发容器中的 Git 仓库 `/workspace/-home`。如果你是通过 Codespaces、GitHub Classroom 或者其它在线环境打开本项目，那么这些修改默认只保存在该环境的仓库副本里，并不会自动推送到你的 GitHub 远程仓库。

要确认是否已经配置远程仓库，可以运行 `git remote -v`。若想把本地的修改同步到 GitHub，请执行 `git push <远程名> <分支名>`（例如 `git push origin work`）。完成推送后，GitHub 仓库页面就会显示本地所有的提交与文件更新。

## 代码检查 / Linting

- 运行 `npm run lint` 以使用 Next.js 推荐的 ESLint 规则检查代码质量。
- 如果本地尚未安装 ESLint 依赖，`npm run test` 会跳过检查并提示如何安装 `eslint` 与 `eslint-config-next`。
