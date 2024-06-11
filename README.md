# Mirage: A Dashboard for All Cinema Content
// course-project-the-epic-dashboard created by GitHub Classroom

Project Members:
* Nayanthara Prathap Menon
* Param Singh Ahuja
* Rohith Reddy Sankuru

Name of the app: Mirage
--------------------------------------------------------------------------------------
This Project is a React app which is a dashboard for Movies. The main features of this web application are:
--------------------------------------------------------------------------------------
* One-stop destination for all movies:	Our Mirage web app is a dashboard containing all movies resourced/fetched from the TMDb API (for the MovieBox) and MongoDB for the Vintage page.	 
* Login/Create Account:	To enable users to view content, track their respective movie search and reviews posted, there is a login feature that has been implemented.	 
* Reviews/Feedback:	Mirage allows users with accounts to post reviews and view others’ reviews.	 
* Search Movies:	The app has a search feature that shows results based on the keywords of movie titles.	 
* View Movies:	View the movies dynamically based on the search keyword.	 
* Movie Details:	The movie details are displayed when the user clicks on a selected movie. On the same page, there are details about the cast, whose links are further clickable and redirects to information about the cast/actor.
--------------------------------------------------------------------------------------
Commands to execute for running our application:
--------------------------------------------------------------------------------------
* $ git clone <enter link of the repository>
- Go to that specific location and install the dependencies of package.json using:
* $ npm install
- To run UI in localhost:3000 :
* $ screen npm run start
- Press 'ctrl+A+D' to detach screen

- Initiate MongoDB using:
* $ systemctl start mongod
- Next, run the backend server using:
* $ screen npm run server

- The backend server is now running on localhost:8000
  
NOTE: Currently we are using the docker image provided by Prof Prasanna, which already contains MongoDB, Express, React, Apollo Server and Node modules. The docker image link is as follows: https://mynbox.nus.edu.sg/userportal/?v=4.5.4#/shared/public/ozb0o7a29JqxNvSH/ac7a0cb7-3c49-4b0d-91c1-8deaf0244862
  
The latest API key is as follows. We have created this so that there is sufficient number of clicks:
  * 'X-RapidAPI-Key': 'b6174df041msh032ad440f20175ap1663c0jsn47caef2dc30d',
  * 'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
  
 Final Demo Video link is present in FinalDemoVideo.md file (https://nusu-my.sharepoint.com/:v:/g/personal/e0963010_u_nus_edu/ETZ2siWrZCJMvmBmVmwoMnUBLoQZ5-9gt18V99YOrdNLPQ)
