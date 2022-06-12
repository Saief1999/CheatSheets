# Creating a complex Config


**IMPORTANT** : we need to add as much headers as it's needed for the link to work

### Get request

- First we add a block , we make the type Get 
- We open the log window
- We Hit start
- in the log we basically get the `csrf` token as a field , basic stuff

### Parse

- we add a parse block to extract the `csrf` token

- we name the variable `csrf`

- we use a selector to select the `csrf` token (in the video he used LR (left-right) so he gave the left and right blocks, and in between is supposed to be the `csrf`)

  - Example : 

    - Left : `name="blahblash" value="`
    - Right : `"/>`

- IF the mode is JSON , instead of prefix/suffix we add the `field Name` and we specify the name
  
- The field will be extracted inside the specified variable



### POST request

- Basically a POST request with the fields inside

1. We put the URL of the POST request (we check the console for the request generally code 300 something)
2. the Content Type  , in case the content type says it's text/html , we leave it as `application/x-www-form-urlencoded` , however if it's `application/json` we need to change it
3. POST Data : 
   1. we check the form body and hit sources (inside the request in the browser)
   2. we copy the body source, paste it , and then add `<USER> <PASS>` (Global variables given by the user , can be tested while building the config) and  `<csrf>` (the name of the Var)
      1. **IMPORTANT** : Variables are case sensitive
4. Origin (we copy and paste it inside the custom header)
5. Referrer (same)
6. User Agent (same)



### Key CHECK

- This block is responsible for checking the server response

1. We add to keychains , one for success and one for failure
   - We can add a custom block for free accounts for example if we want 
2. In success :
   1. we add new key :
      1. Type : source
      2. contains
      3. we put the message (something unique for the success page)
         - For example : we add two sources : `designation` and My `Account` , if either is seen , it's marked as a success and the program will carry on
3. In failure :(program will not carry if it's a failure)
   1. We add a new key
      1. Type : source
      2. contains
      3. we put the message (for example : invalid username or password)

**IMPORANT** : To test  in the debugger :we set the data type as credentials and we put `user:pass`

- Content of the data will be parsed into `<USER>` and `<PASS>` global variables



### PARSE (for capturing the info)



- **Before Doing Anything**, if the link for the info is different from the success page , we do a GET Request to that page FIRST ! 
- **we check** `Is Capture`
- we give our variable a name (so it will be shown in the capture later)
- we add our selector



**IMPORTANT** : Each Block is dependent from the last request , the program is `stateful` kind of.



### Exporting the project 

- other options
  - In General : we set the default bots number for the config
  - In Proxies : we set if the program needs proxies or no 
  - In Data : we set the allowed wordlist Types (for example `emailpass`in both fields)

- manager : we save the project



# Captcha 

- Avoid re captcha solvers , it's a last resort
- they take up to 20 secs , which is a lot, AND you have to pay for one of these
- 2captcha seems to be good and fast
- We can use http://testing-ground.webscraping.pro/ to test re captcha

1. GET request to the website
2. RECAPTCHA block 
   1. we add the variable name  ( `recaptcha` for example )
   2. the page URL(it can be a popup, so we need to put the new page)
   3. we click Auto site Key (will auto grab the key from the site , if it doesn't work there's a way to grab manually)
3. We do the POST REQUEST
   1. We add the `<user> <pass>` , other stuff depending on the body , then we add the `recaptcha` **name**  ( which depend of the body ) and **value** that we grabbed inside the variable `<recaptcha>`
4. we grab User-agent,origin,referrer,Host  (As usual) and we add them to the custom headers

**IMPORTANT** : 

- We can put the global variables inside the header , body , or even the Key check ! (inside the keys)

- we can put `DoesNotContain` for Failure !

---

# Analyzing Configs

## Checking `Spotify_Proxyless_Fixed`



- he started by doing a getToken() then postToken() in google
- get request to get the cookies and extracted the fields later
- he encoded the pass / username , pretty standard stuff



## Checking the script I've been using (needs proxy)

- he basically did a one liner for authentication then 500 lines wasting time (he extracted data he didn't even use , then just used the same url as`Spotify_Proxyless_Fixed` to get the profile info)