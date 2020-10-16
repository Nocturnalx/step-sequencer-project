var mixingDeskArray = []; // Set up mixingdesk list
var channel1;
var channel2;


//listener for add channel button
let btnAddChannel = document.getElementById('btnAddChannel');
btnAddChannel.addEventListener("click", addChannel);

let btnPlay = document.getElementById('btnPlay');
btnPlay.addEventListener("click", play);

let btnPause = document.getElementById('btnPause');
btnPause.addEventListener("click", pause);


//~~functions~~

//function draws elements for a given channel
function drawChannel(channel){
	//desk div in body
	var desk = document.getElementById('desk'); 

	//create div for channel	
	var channelDiv = document.createElement('div');
	channelDiv.classList.add("col");
	channelDiv.id = channel.index;
	channelDiv.style = "padding-bottom: 25px;";
	desk.appendChild(channelDiv);		
	
	//create <p> containing channel name
	var channelName = document.createElement('p');
	channelName.innerHTML = channel.name;
	channelDiv.appendChild(channelName);
	
	//create slider for volume
	var channelSlider = document.createElement('input');
	channelSlider.type = "range";
	channelSlider.min = 0;
	channelSlider.max = 100;
	channelSlider.value = channel.volume;	
	channelSlider.id = channel.name;
	channelDiv.appendChild(channelSlider);
	
	//<p> that shows current volume for slider
	var channelVolume = document.createElement('p');
	channelVolume.id = channel.name + "Vol";
	channelVolume.innerHTML = channel.volume;
	channelDiv.appendChild(channelVolume);
	
	//create mute button
	var btnMute = document.createElement('input');
	btnMute.type = "button";
	btnMute.id = channel.name + "Mute";
	btnMute.value = "Mute";
	btnMute.classList.add("button");
	channelDiv.appendChild(btnMute);		
	channelDiv.appendChild(document.createElement('br'));
	//inputs like being together so add break (might be able to do this in css but i cant be arsed)
	
	//create remove button
	var btnRemove = document.createElement('input');
	btnRemove.type = "button";
	btnRemove.id = channel.name + "Remove";
	btnRemove.value = "Close";
	btnRemove.classList.add("button");
	channelDiv.appendChild(btnRemove);
}

//instantiate new channel object
function channelObj(chName, chVolume, chPan, chIndex, chSource){
	this.name = chName;
	this.pan = chPan;
	this.volume = chVolume;
	this.index = chIndex;
	this.source = chSource;
	this.muted = false;
	var channel = this;
	
	
	this.volListener = function(){
		let slider = document.getElementById(channel.name);
		slider.addEventListener("input", function(){	
			channel.volume = slider.value;
			
			if(channel.muted == false){
				let volumeDisplay = document.getElementById(channel.name + "Vol");
				volumeDisplay.innerHTML = channel.volume;
				//source.volume = channel.volume
			}			
		});
	}
	
	this.removeListener = function(){ //IF NAME EXISTS WHEN ADD CHANNEL IS CLICKED IT NEEDS TO CHANGE ITS NAME TO "ch x(x)" do this in addChannel()
	
		let btnRemove = document.getElementById(channel.name + "Remove");
		btnRemove.addEventListener("click", function(){
			
			//delete channels div
			var channelDiv = document.getElementById(channel.index);
			channelDiv.remove();
				
			//splice to get rid of item from middle of array
			mixingDeskArray.splice(channel.index,1);
			
			//set indexes of all new arrays to theyre new place
			for(i = channel.index; i < mixingDeskArray.length; i++){
				// "_" prefix is shifted channels
				let _channel = mixingDeskArray[i];
				//use old index for div to get
				let _channelDiv = document.getElementById(_channel.index);
				//set div-id and index to new place
				_channelDiv.id = i;
				_channel.index = i;
			}
						
		});
	}
	
	this.muteListener = function(){
		let btnMute = document.getElementById(channel.name + "Mute");
		btnMute.addEventListener("click", function(){
			
			let volumeDisplay = document.getElementById(channel.name + "Vol");
			
			//have bool for mute or not (not mute by default) if(bool) then either muted or un mute have vol still be original vol but make channel mute
			if(channel.muted == false){
				channel.muted = true;
				volumeDisplay.innerHTML = "Muted";
				
				//just mute the source but not turn slider down can show mute with volume display paragraph
				//source.volume = 0
			} else{
				channel.muted = false;
				volumeDisplay.innerHTML = channel.volume;
				//unmute
				//source.volume = channel.volume
			}
		});
	}
	
	//pan slider needs adding in on the draw but function is complete
	this.panListener = function(){
		let panSlider = document.getElementById(channel.name + "Pan");
		panSlider.addEventListener("input", function(){
			channel.pan = panSlider.value;
			
			console.log(channel.name + " " + channel.pan)
		});
	}
	
}

//add channel to channel list and draw it
function addChannel(){
	//get and reset tbx
	let tbx = document.getElementById('newChannelName');
	let newChannelName = tbx.value;
	tbx.value = "";

	//creating new channel object and adding to array
	let channelIndex = mixingDeskArray.length;

	//validation (object doesnt like not having a name :( )
	if(newChannelName.length == 0){
		let channelNo = channelIndex + 1;
		newChannelName = "ch: " + channelNo;
	}

	let source = document.getElementById('guitar');
	let newChannel = new channelObj(newChannelName, 0.0, 0.0, channelIndex, source);
	mixingDeskArray.push(newChannel);
	drawChannel(newChannel);

	newChannel.volListener();
	newChannel.removeListener();
	newChannel.muteListener();
	
}

function play(){
	console.log("play");
}

function pause(){
	console.log("pause");
}