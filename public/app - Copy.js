document.addEventListener("DOMContentLoaded", event => {
	
	const app = firebase.app();
	const db = firebase.firestore();
	const settings = {/* your settings... */ timestampsInSnapshots: true};
	db.settings(settings);
	const zeEmails = db.collection('emailaddresses').doc('usedemails');
	
	let usedEmails = [];
	let inputEmail;

	//SAVE EMAIL ADDRESS FROM FORM SUBMISSION
	
	// 	document.querySelector("#myForm").addEventListener("submit", function(e){
	//     if(!isValid){
	//         e.preventDefault();    //stop form from submitting
	//     }
	// 	});
	
	let ele = document.getElementById('emailForm')
	if(ele.addEventListener){
	    ele.addEventListener("submit", checkEmail, false);  //Modern browsers
	}else if(ele.attachEvent){
	    ele.attachEvent('onsubmit', checkEmail);            //Old IE
	};

	function checkEmail(e){
		e.preventDefault();
		
		inputEmail = document.getElementById('newEmailAddress').value; //user's email saved as variable
		let inputEmailLow = inputEmail.toLowerCase()


		//RETRIEVE EMAIL ARRAY
		
		zeEmails.get()
			.then(doc => {
				const data = doc.data();
				usedEmails = data.emails;

				let inputEmailUsed = (usedEmails.indexOf(inputEmailLow) > -1);

				if (inputEmailUsed == true){
					var noPlayCont = document.getElementById('noPlay');
					noPlayCont.classList.add('show-noplay');
					noPlayCont.classList.remove('hidden');
				}else{
					
					//THE COUNTDOWN

					let timeLeft = 5;
				    let timerDiv = document.getElementById('timerDiv');
				
				    let timerId = setInterval(countdown, 1000);
				    
				    function countdown() {
				      if (timeLeft == 0) {
				        clearTimeout(timerId);
				        gameOver();
				      } else {
				        timerDiv.innerHTML = timeLeft + ' seconds remaining';
				        timeLeft--;
				      }
				    }

				    //SHOW GAME
					let mainGame = document.getElementById('mainCont');
					mainGame.classList.add('show-card');
					mainGame.classList.remove('hidden');
					
					//HIDE FORM AND LOGO
					let formCont = document.getElementById('formDiv');
					formCont.classList.add('hidden');
					
					let logoCont = document.getElementById('logoDiv');
					logoCont.classList.add('hidden');

					//DRAGGABLE STUFF
					let scoreDiv = document.getElementById('scoreDiv');
					let eggScore = 0;

					$( function() {
					  $( "#eggOne, #eggTwo" ).draggable({
					  	containment: "parent",
					  });
					  
					  $( "#basketDiv" ).droppable({
					      drop: function( event, ui ) {
					          ++eggScore;
					          console.log(eggScore);
          			        scoreDiv.innerHTML = eggScore + ' Points';
					      	}
					    });
					} );


					// $( function() {
					//   $( "#eggOne, #eggTwo" ).draggable({grid: [50,20]});
					// } );
					
					// // Getter
					// let grid = $( "#eggOne, #eggTwo" ).draggable( "option", "grid" );
					 
					// // Setter
					// $( "#eggOne, #eggTwo" ).draggable( "option", "grid", [ 50, 20 ] );
										
					let zeBasket = document.getElementById('basketDiv');
					  
					prizePopup.innerHTML = "<h2 class='popup-h2-1-l'>" + prizeObject.prize + "</h2><h2 class='popup-h2-2'></h2><a href='http://www.sunriserecords.com'><button class='popup-btn'>Go to sunriserecords.com</button></a>";
					prizePopup.classList.add('popup-show');		

					
					function gameOver(){
						if (eggScore=="2"){
							zeEmails.update({
								winners: firebase.firestore.FieldValue.arrayUnion(inputEmailLow)
							});
							alert("YOU WIN");
						}else{
							alert("YOU LOSE");
						}
					}	
				}

				//ADD USER EMAIL TO ARRAY
				zeEmails.update({
					emails: firebase.firestore.FieldValue.arrayUnion(inputEmailLow)
				});
				//zeEmails.update({ emails: email.target.value }) <----THIS WILL UPDATE A STRING
			})	

	}


})


