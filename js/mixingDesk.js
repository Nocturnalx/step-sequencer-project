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
	channelName.id = channel.index + "Name";
	channelDiv.appendChild(channelName);
	
	//create slider for volume
	var volumeSlider = document.createElement('input');
	volumeSlider.type = "range";
	volumeSlider.min = 0;
	volumeSlider.max = 100;
	volumeSlider.value = channel.volume;	
	volumeSlider.id = channel.index + "Vol";
	channelDiv.appendChild(volumeSlider);
	
	//<p> that shows current volume for slider
	var channelVolume = document.createElement('p');
	channelVolume.id = channel.index + "VolDisplay";
	channelVolume.innerHTML = channel.volume;
	channelDiv.appendChild(channelVolume);
	
	//create slider for pan min = -50 max = +50 default  = 0
	var panSlider = document.createElement('input');
	panSlider.type = "range";
	panSlider.min = -50;
	panSlider.max = 50;
	panSlider.value = channel.pan;
	panSlider.id = channel.index + "Pan";
	channelDiv.appendChild(panSlider);
	
	//create <p> that updates for pan slider value
	var channelPan = document.createElement('p');
	channelPan.id = channel.index + "PanDisplay";
	channelPan.innerHTML = channel.pan;
	channelDiv.appendChild(channelPan);
	
	//create mute button
	var btnMute = document.createElement('input');
	btnMute.type = "button";
	btnMute.id = channel.index + "Mute";
	btnMute.value = "Mute";
	btnMute.classList.add("button");
	channelDiv.appendChild(btnMute);	
	
	//inputs like being together so add break (might be able to do this in css but i cant be arsed)
	channelDiv.appendChild(document.createElement('br'));
	
	//create remove button
	var btnRemove = document.createElement('input');
	btnRemove.type = "button";
	btnRemove.id = channel.index + "Remove";
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
	
	
	this.sliderVolume_EventHandler = function(){
		let slider = document.getElementById(channel.index + "Vol");
		slider.addEventListener("input", function(){	
			channel.volume = slider.value;
			
			if(channel.muted == false){
				let volumeDisplay = document.getElementById(channel.index + "VolDisplay");
				volumeDisplay.innerHTML = channel.volume;
				//source.volume = channel.volume
			}			
		});
	}
	
	this.btnRemove_EventHandler = function(){ //IF NAME EXISTS WHEN ADD CHANNEL IS CLICKED IT NEEDS TO CHANGE ITS NAME TO "ch x(x)" do this in addChannel()
	
		let btnRemove = document.getElementById(channel.index + "Remove");
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
				//use old index to get then set new ids
				document.getElementById(_channel.index).id = i;
				document.getElementById(_channel.index + "Name").id = i + "Name";
				document.getElementById(_channel.index + "Vol").id = i + "Vol";
				document.getElementById(_channel.index + "VolDisplay").id = i + "VolDisplay";
				document.getElementById(_channel.index + "Pan").id = i + "Pan";
				document.getElementById(_channel.index + "PanDisplay").id = i + "PanDisplay";
				document.getElementById(_channel.index + "Mute").id = i + "Mute";
				document.getElementById(_channel.index + "Remove").id = i + "Remove";
				
				//set index to new place
				_channel.index = i;
				
			}
						
		});
	}
	
	this.btnMute_EventHandler = function(){
		let btnMute = document.getElementById(channel.index + "Mute");
		btnMute.addEventListener("click", function(){
			
			let volumeDisplay = document.getElementById(channel.index + "VolDisplay");
			
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
	this.sliderPan_EventHandler = function(){
		let panSlider = document.getElementById(channel.index + "Pan");
		panSlider.addEventListener("input", function(){
			let pan = panSlider.value;
			channel.pan = pan;
			
			let panDisplay = document.getElementById(channel.index + "PanDisplay");
			panDisplay.innerHTML = pan;
		});
	}
	
	//event listner for name change
	this.nameChange_EventHandler = function(){
		let nameTag = document.getElementById(channel.index + "Name");
		nameTag.addEventListener("dblclick", function(){
			var newName = prompt("Enter channel name:");
			nameTag.innerHTML = newName;			
			channel.name = newName;
			
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

	newChannel.sliderVolume_EventHandler();
	newChannel.btnRemove_EventHandler();
	newChannel.btnMute_EventHandler();
	newChannel.sliderPan_EventHandler();
	newChannel.nameChange_EventHandler();
}

function play(){
	console.log("play");
}

function pause(){
	console.log("pause");
}