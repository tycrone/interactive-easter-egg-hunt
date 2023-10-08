document.addEventListener("DOMContentLoaded", function(event){
	
	const app = firebase.app();
	const db = firebase.firestore();
	const settings = {timestampsInSnapshots: true};
	db.settings(settings);
	const zeEmails = db.collection('emailaddresses').doc('usedemails');

	let usedEmails = [];
	let inputEmail;


	//FUNCTION FOR RETRIEVING EMAILS 

	// let emailCont = document.getElementById('enteredemails');

	// db.collection("emailaddresses").get().then(function(querySnapshot) {
	//     querySnapshot.forEach(function(doc) {
	//         // doc.data() is never undefined for query doc snapshots console.log(doc.data());
	//         let emailArray = doc.data();
	//         let emailArray2 = emailArray.newslettersignup;

	//         emailArray2.forEach(element => {
	// 		  emailCont.innerHTML += (element) + "</br>";
	// 		});
	//     });
	// });

	//SAVE EMAIL ADDRESS FROM FORM SUBMISSION
	
	// 	document.querySelector("#myForm").addEventListener("submit", function(e){
	//     if(!isValid){
	//         e.preventDefault();    //stop form from submitting
	//     }
	// 	});
	
	//GO LANDSCAPE
	if(window.innerHeight > window.innerWidth){
    	alert("Sunrise Records Says: Please rotate your phone to landscape!");
	}

	let ele = document.getElementById('emailForm')
	if(ele.addEventListener){
	    ele.addEventListener("submit", checkEmail, false);
	}else if(ele.attachEvent){
	    ele.attachEvent('onsubmit', checkEmail);      
	};

	function checkEmail(e){
		e.preventDefault();

		inputEmail = document.getElementById('newEmailAddress').value; //user's email saved as variable
		let inputEmailLow = inputEmail.toLowerCase() //lowercase that email

		//NEWSLETTER STUFF
		let optin = document.querySelector('[name="optinBox"]:checked');

		if(optin){
			zeEmails.update({
				newslettersignup: firebase.firestore.FieldValue.arrayUnion(inputEmailLow)
			});
		}

		//RETRIEVE EMAIL ARRAY
		
		zeEmails.get()
			.then( function(doc){
			//.then(doc => { <----NON IE COMPATIBLE ARROW FUNCTION

				document.body.style.background = "#000000";

				const data = doc.data();
				usedEmails = data.emails;

				let inputEmailUsed = (usedEmails.indexOf(inputEmailLow) > -1);

				if (inputEmailUsed == true){
					let noPlayCont = document.getElementById('noPlay');
					noPlayCont.classList.add('show-noplay');
					noPlayCont.classList.remove('hidden');
				}else{
					let noPlayCont = document.getElementById('noPlay');
					noPlayCont.classList.add('hidden');
					noPlayCont.classList.remove('show-noplay');

	    			//SHOW GAME
					let mainGame = document.getElementById('mainCont');
					mainGame.classList.add('show-card');
					mainGame.classList.remove('hidden');
					
					//HIDE FORM AND LOGO
					let formCont = document.getElementById('formDiv');
					formCont.classList.add('hidden');
					
					let logoCont = document.getElementById('logoDiv');
					logoCont.classList.add('hidden');

					//instructions popup
					let instPopup = document.getElementById('instPopup');
					instPopup.classList.remove('hidden');	
					instPopup.classList.add('show-inst-popup');

					document.getElementById("popup2-btn").onclick = beginGame;

					function beginGame(){

						instPopup.classList.add('hidden');	
						instPopup.classList.remove('show-inst-popup');

						//SHOW EGGS
						let eggsClass = document.querySelectorAll('.egg-div');
						let eggsArray = Array.prototype.slice.call(eggsClass, 0);   						
   						eggsArray.forEach(function(egg){
   							egg.classList.remove('hidden');
   							egg.classList.add('show-egg');
   						});

						//THE COUNTDOWN

						let timeLeft = 120;
						
					    let timerDiv = document.getElementById('timerDiv');
					
					    let timerId = setInterval(countdown, 1000);
						let	timerOff = false;
	    

						//TIMER STUFF
					    function countdown() {
					      if (timeLeft == -1) {
					        clearTimeout(timerId);
					        gameOver();
					      }else if(timerOff == true){
					        clearTimeout(timerId);
					      } else {
					       	let minutes = Math.floor(timeLeft / 60);
							let seconds = timeLeft - minutes * 60;
							
							let secondsZero = (function(){
							  let secondsZ = seconds;
							  if(secondsZ < 10) {
							  	secondsZ = "0" + secondsZ;
							  }
							  return secondsZ;
							})();

					        timerDiv.innerHTML = 'TIME: 0' + minutes + ':' + secondsZero;
					        timeLeft--;
					      }
					    }

						//SET EGG SIZE

						let scrollTop = 0;
						
						let zeEggs = document.getElementsByClassName("egg-div");

						Array.prototype.forEach.call(zeEggs, function(egg) {
						    let eggID = egg.id;
						    let eggID2 = '#' + eggID;
						   	let elementOffsetInitial = $(eggID2).offset().top;
							let distanceInitial = (elementOffsetInitial - scrollTop) / 23;
							$(eggID2).width(distanceInitial + 'px');
						});

						//INCREASE SIZE AS NEARS BOTTOM OF SCREEN
						function updateDistance(){
							if ($('.ui-draggable-dragging').length > 0) { 
							    let elementOffset = $('.ui-draggable-dragging').offset().top;
							    let distance = (elementOffset - scrollTop) / 23;
								// let eggDist = document.getElementById('eggOne');
								// let space = window.innerHeight - eggDist.offset().top;
								// let space2 = space / (3);

								$('.ui-draggable-dragging').width(distance + 'px');
							}
						}
							
						setInterval(updateDistance, 100);

						//DRAGGABLE STUFF
						let scoreDiv = document.getElementById('scoreDiv');
						let eggScore = 0;

						$(".egg-div").click(function() {
						  $(this).addClass('ontheverytop');
						});

					  	$(".egg-div").draggable({
					  		containment: "parent",
					  	});
					  
					  	$( "#basketDiv" ).droppable({
					    	drop: droppedDown
					    });
					  	
					  	function droppedDown( event, ui ) {
				          	++eggScore;
	       			        scoreDiv.innerHTML = 'EGGS: ' + eggScore + '/25';
	       			        //console.log( $(ui.draggable).attr('id'));
	       			        let $this = $(this);

	       			        let randomNumber = Math.floor(Math.random()*(68-10+1)+10);
	       			        // let randomNumber = Math.floor(Math.random() * 20) + 32;
	       			        let randomNumber2 = randomNumber.toString();
	       			        console.log(randomNumber2);

	       			        let positionx1 = "right";
	       			        let positionx2 = positionx1 + "-" + randomNumber2;

						    ui.draggable.position({
						      my: positionx2,
						      at: positionx2,
						      of: $this,
						      using: function(pos) {
						        $(this).animate(pos, "slow", "linear");
						      }
						    });
						    ui.draggable.draggable({disabled: true});

						    if (eggScore == 25){
					    		youWin();
					    	};
					    };

					 

						// $( function() {
						//   $( "#eggOne, #eggTwo" ).draggable({grid: [50,20]});
						// } );
						
						// // Getter
						// let grid = $( "#eggOne, #eggTwo" ).draggable( "option", "grid" );
						 
						// // Setter
						// $( "#eggOne, #eggTwo" ).draggable( "option", "grid", [ 50, 20 ] );
											
						let zeBasket = document.getElementById('basketDiv');
						  
						

						//Triggered by eggScore = 25
						function youWin(){
							timerOff = true;
							zeEmails.update({
								winners: firebase.firestore.FieldValue.arrayUnion(inputEmailLow)
							});
							prizePopup.innerHTML = "<div class='win-col1'><h2 class='popup-h2-1-l'>NAILED IT!</h2><h2 class='popup-h2-2'>Our gift to you:</h2><a href='/files/sunriserecords-5dollarsoff.pdf'><button class='popup-btn2'>Print Your Coupon</button></a><a href='https://www.sunriserecords.com'><button class='popup-btn2'>Go to sunriserecords.com</button></a></div><div class='win-col2'><img class='coupon-img' src='../img/coupon-img.jpg'></div>";
							prizePopup.classList.add('popup-show');						
						}

						//Triggered by Timer = 0
						function gameOver(){
							prizePopup.innerHTML = "<h2 class='popup-h2-1-l'>SORRY, TOO SLOW</h2><h2 class='popup-h2-2'>Happy Easter from Sunrise Records.</h2><a href='http://www.sunriserecords.com'><button class='popup-btn'>Go to sunriserecords.com</button></a>";
							prizePopup.classList.add('popup-show');
						}	

						//ADD USER EMAIL TO ARRAY
						zeEmails.update({
							emails: firebase.firestore.FieldValue.arrayUnion(inputEmailLow)
						});
					}
				}
			})	
	}
})


