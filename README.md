1. Point at your unorganised meme folder: `node main.js /home/robin/Pictures/Memes/`
2. Wait...
3. You are now able to actually search and find that one meme you are looking for again.

Node.js script that iterates over files in a given folder, runs (English) text recognition
on each image it encounters, and renames the file to the text it contains so that your
file manager's search feature is actually useful in helping you find things.

## Restrictions

- English language (though easy to change)
- Assumes a filename length limit of 255 characters (true for every relevant filesystem)
