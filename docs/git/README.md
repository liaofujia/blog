---
sidebar: auto
---
# Git

## git checkout

### 基于远程分支创建本地新分支

格式：

`git checkout -b 新的分支名 远程仓库别名/远程仓库分支名`

```shell
git checkout -b christine origin/detail
```

## git push

```git
git push <远程主机名> <本地分支名>:<远程分支名>

栗子：
git push git@github.com:xxx.git master:gh-pages
```

>如果本地分支名和远程分支名相同，则可以省略冒号：

```git
git push <远程主机名> <本地分支名>
git push origin master or git push
```

>如果本地版本与远程版本有差异，但又要强制推送可以使用--force参数：

```git
git push --force | -f origin master
```

>删除远程的分支可以使用--delete或-d参数，以下命令表示删除远程的master分支

```git
git push --delete | -d origin master
```

## git clone

```shell
git clone https://codeup.aliyun.com/xxx/xxx.git/
```

![alt git报403](/blog/git403.jpg)
**错误原因**：
git 客户端缓存了错误的密码，账号密码和本地存储的混淆。一般是多个git账号会导致这样的情况，比如自己的账号和公司的账号同时一起使用。

**解决方案**：
clone时，把账号和密码拼接在clone的url中。

```shell
git clone https://用户名:密码@codeup.aliyun.com/xxx/xxx.git/
```

## git reset

> git reset [--soft | --mixed | --hard] [HEAD]

* `--mixed`： 为默认，可以不用带该参数，用于重置暂存区的文件与上一次的提交(commit)保持一致，工作区文件内容保持不变。
* `--soft`： 参数用于回退到某个版本。
* `--hard`： 参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交。

回退上个版本：

```shell
git reset --hard HEAD^
```

:::tip
HEAD是指向当前版本的指针，HEAD^表示上个版本,HEAD^^表示上上个版本

HEAD~0 表示当前版本

HEAD~1 上一个版本

HEAD^2 上上一个版本

HEAD^3 上上上一个版本
:::

回退到指定版本：

栗子：

```shell
42eae13 (HEAD -> master) 第四次修改
97ea0f9 第三次修改
e50b7c2 第二次修改
3a52650 第一次修改
```

如果发现，在第四次修改有错误，需要回滚到第三次修改，就可以用reset命令来回退。

执行 `git reset --hard 97ea0f9`，这个时候，git的提交历史变为:

```shell
97ea0f9 (HEAD -> master) 第三次修改
e50b7c2 第二次修改
3a52650 第一次修改
```

可以看到master当前指向97ea0f9这个版本，我们回到了第三次修改。

使用reset命令，Git会把要回退版本之后提交的修改都删除掉。要从第四次修改回退到第一次修改，那么会删除第二、三、四次的修改。【注：这里并不是真正的物理删除】

## git revert

```shell
git revert commit-id
```

撤销某个提交，但执行命令后进入编辑界面。

```shell
git revert -n commit-id
```

撤销某个提交，但执行命令后不进入编辑界面，更改的文件会移至暂存区，需要手动提交，这与 `git revert commit-id` 的差别就是撤销和提交分开了。
