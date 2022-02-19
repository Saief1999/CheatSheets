

## Rebase (very important)

Start it with the oldest commit you want to retain as-is:

`git rebase -i <after-this-commit>`

An editor will be fired up with all the commits in your current branch (ignoring merge commits), which come after the given commit. You can reorder the commits in this list to your heart's content, and you can remove them. The list looks more or less like this:

```
pick deadbee The oneline of this commit
pick fa1afe1 The oneline of the next commit
...
```

The oneline descriptions are purely for your pleasure; git-rebase will not look at them but at the commit names ("deadbee" and "fa1afe1" in this example), so do not delete or edit the names.

By replacing the command "pick" with the command "edit", you can tell git-rebase to stop after applying that commit, so that you can edit the files and/or the commit message, amend the commit, and continue rebasing.

If you want to fold two or more commits into one, replace the command "pick" with "squash" for the second and subsequent commit. If the commits had different authors, it will attribute the squashed commit to the author of the first commit.

## Recovery in case of Reset --Hard

First , get the dangling commit ( that we removed ) and that's by doing 

```bash
git fsck --lost-found
```

This will write all the unreferenced files to a `lost-found` folder in `.git`, and shows the id of the commit ,  to get a branch containing that commit we do 

```bash
git checkout -b recovery-branch commit-id
```



## Ignoring files

To see ignored folders and files, run 

```bash
git status --ignored
```

To remove newly ignored files, run 

```bash
gir rm --cached -r *
```

