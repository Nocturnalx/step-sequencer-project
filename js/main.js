var mixingDeskArray = []; // Set up mixingdesk list
var playing = false;

var masterVolDisplay = document.getElementById('masterVolDisplay');
var masterVolSlider = document.getElementById('masterVolSlider');
masterVolDisplay.innerHTML = masterVolSlider.value;

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
	
	//container for channel div and hidden effects div
	var channelContainer = document.createElement('div');
	channelContainer.id = channel.index + "Container";
	channelContainer.classList.add("row");
	channelContainer.classList.add("channelDiv");
	desk.appendChild(channelContainer);

	//CHANNEL DIV
	
	//create div for channel
	var channelDiv = document.createElement('div');
	channelDiv.classList.add("col");
	channelDiv.id = channel.index;
	channelDiv.style.cursor = "pointer";
    channelDiv.style.width = "160px";
    channelDiv.style.overflow = "hidden";
	channelContainer.appendChild(channelDiv);		
	
	//create <p> containing channel name
	var channelName = document.createElement('p');
	channelName.innerHTML = channel.name;
	channelName.id = channel.index + "Name";
	channelName.style.cursor = "text";
	channelDiv.appendChild(channelName);
	
	//create slider for volume
	var volumeSlider = document.createElement('input');
	volumeSlider.type = "range";
	volumeSlider.min = -60;
	volumeSlider.max = 10;
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
	
	//div containing effects info
	var effectsDiv = document.createElement('div');
	effectsDiv.id = channel.index + "EffectsDiv";
	effectsDiv.classList.add('col');
	effectsDiv.style.display = "none";
	effectsDiv.classList.add("effectsDiv");
	channelContainer.appendChild(effectsDiv);
	
}

//draws elements for sequencer in a channel
function drawSequencer(channel){
	//declare sequencer roll (parent)
	var sequencerRoll = document.getElementById('sequencerRoll');
	
	var seqDiv = document.createElement('div');
	seqDiv.classList.add("row");	
	seqDiv.id = channel.index + "Seq";
	sequencerRoll.appendChild(seqDiv);
	
	//create p with channel name
	var seqNameDiv = document.createElement('div');
	seqNameDiv.id = channel.index + "SeqNameDiv";
	seqNameDiv.classList.add("sequencerNameDiv");
	seqDiv.appendChild(seqNameDiv);
	
	var seqNameLabel = document.createElement('p');
	seqNameLabel.id = channel.index + "SeqNameLabel";
	seqNameLabel.classList.add("seqNameLabel");
	seqNameLabel.innerHTML = channel.name;
	seqNameDiv.appendChild(seqNameLabel);
	
	for (i = 0; i < 8; i++)
	{
		//draw each step for channel
		var btnStep = document.createElement('img');		
		btnStep.classList.add("step");		
		
		var step = new stepObj(channel, i);	
		channel.stepArray.push(step);
		btnStep.src = "resources/pad.png";
		
		btnStep.id = step.channelIndex + "step" + step.index;		
		seqDiv.appendChild(btnStep);
		
		step.click_EventHandler();
	}
}

function drawEffects(channel){
    var effectsDiv = document.getElementById(channel.index + 'EffectsDiv');
    var effectsArray = channel.effects.effectsArray;

    for (i = 0; i < effectsArray.length; i++) {
        var effect = effectsArray[i];

        //create label
        var effectLabel = document.createElement('p');
        effectLabel.innerHTML = effect.name;
        effectsDiv.appendChild(effectLabel);

        //create label, slider and display for each parameter of effect
        var parameterArray = effect.parameterArray;

        for (i = 0; i < parameterArray.length; i++) {
            var parameter = parameterArray[i];

            var parameterLabel = document.createElement('p');
            parameterLabel.innerHTML = parameter.name;
            effectsDiv.appendChild(parameterLabel);

            var parameterSlider = document.createElement('input');
            parameterSlider.type = "range";
            parameterSlider.min = parameter.min;
            parameterSlider.max = parameter.max;
            parameterSlider.value = parameter.sliderValue;
            parameterSlider.id = channel.index + parameter.idName + "Slider";
            effectsDiv.appendChild(parameterSlider);

            var parameterDisplay = document.createElement('p');
            parameterDisplay.innerHTML = parameter.defaultValue;
            parameterDisplay.id = channel.index + parameter.idName + "Display";
            effectsDiv.appendChild(parameterDisplay);
        }

        //create button
        var effectButton = document.createElement('input');
        effectButton.type = "button";
        effectButton.value = "connect";
        effectButton.id = channel.index + "btn" + effect.name;
        effectButton.classList.add("button");
        effectsDiv.appendChild(effectButton);
    }
}

//instantiate new channel object
function channelObj(chName, chVolume, chPan, chIndex){
	this.name = chName;
	this.pan = chPan;
	this.volume = chVolume;
	this.index = chIndex;
	this.muted = false;
	this.effectsShowing = false;
	var nodeArr = [];
	this.nodeArray = nodeArr;
	var channel = this;

	var arr1 = [];
	this.stepArray = arr1;
    var arr2 = [null,null,null,null,null,null,null,null];
	this.noteArray = arr2;
	
	//SYNTH AND SEQUENCE
	
	//create synth node, add to array
	this.synth = new Tone.MembraneSynth();
	channel.synth.volume.value = channel.volume;
	channel.nodeArray.push(channel.synth);
	
	//create pan node, add to array
	this.panNode = new Tone.PanVol(0,0);
	channel.nodeArray.push(channel.panNode);
	
	//connect synth to pan
	channel.synth.connect(channel.panNode);
	
	//apply final node in array to master
	channel.nodeArray[channel.nodeArray.length - 1].toMaster();
	
	//create sequence for synth from array
	this.sequence = new Tone.Sequence(function(time, note) {
		channel.synth.triggerAttackRelease(note,"8n");
	}, channel.noteArray, "8n");	
	channel.sequence.start();

	//CREATE EFFECTS OBJECT
	this.effects = new effectsObj(this);

	//EVENT LISTENERS AND METHODS
	
	this.startEventListeners = function(){
		//volume slider
		let slider = document.getElementById(channel.index + "Vol");	
		slider.addEventListener("input", function(){	
			channel.volume = slider.value;
			
			if(channel.muted === false){
				let volumeDisplay = document.getElementById(channel.index + "VolDisplay");
				volumeDisplay.innerHTML = channel.volume;
				channel.synth.volume.value = channel.volume;
			}			
		});
		
		//remove channel button
		let btnRemove = document.getElementById(channel.index + "Remove");
		btnRemove.addEventListener("click", function(){
			
			//delete channels div
			var channelContainer = document.getElementById(channel.index + "Container");
			channelContainer.remove();
			
			var rollDiv = document.getElementById(channel.index + "Seq");
			rollDiv.remove();
			
			channel.synth.dispose();
			channel.effects.reverb.reverb.dispose();
			channel.sequence.stop();
			channel.sequence.dispose();
			
			//splice to get rid of item from middle of array
			mixingDeskArray.splice(channel.index,1);
			
			//set indexes of all new arrays to their new place
			for(i = channel.index; i < mixingDeskArray.length; i++){
				// "_" prefix is shifted channels
				let _channel = mixingDeskArray[i];
				//use old index to get then set new ids
				
				//container
				remove("Container", _channel.index, i);
				
				//change channels ids
				remove("", _channel.index, i);
				remove("Name", _channel.index, i);
				remove("Vol", _channel.index, i);
				remove("VolDisplay", _channel.index, i);
				remove("Pan", _channel.index, i);
				remove("PanDisplay", _channel.index, i);
				remove("Mute", _channel.index, i);
				remove("Remove", _channel.index, i);
				
				//change step containers ids
				remove("Seq", _channel.index, i);
				remove("SeqNameDiv", _channel.index, i);
				remove("SeqNameLabel", _channel.index, i);
				
				for(n = 0; n < 8; n++){
                    remove("step" + n, _channel.index, i);
				}
				
				//change effects containers ids
				remove("EffectsDiv", _channel.index, i);
				remove("ReverbRoomSizeSlider", _channel.index, i);
				remove("ReverbRoomSizeDisplay", _channel.index, i);
				remove("ReverbDampeningSlider", _channel.index, i);
				remove("ReverbDampeningDisplay", _channel.index, i);
				remove("btnReverb", _channel.index, i);
				
				//set index to new place
				_channel.index = i;				
			}			
		});
		
		//mute button 
		let btnMute = document.getElementById(channel.index + "Mute");
		btnMute.addEventListener("click", function(){
			
			let volumeDisplay = document.getElementById(channel.index + "VolDisplay");
			
			//have bool for mute or not (not mute by default) if(bool) then either muted or un mute have vol still be original vol but make channel mute
			if(channel.muted === false){
				channel.muted = true;
				volumeDisplay.innerHTML = "Muted";
				
				channel.synth.volume.value = -100;
			} else{
				channel.muted = false;
				volumeDisplay.innerHTML = channel.volume;
				
				channel.synth.volume.value = channel.volume;
			}
		});
		
		//pan slider
		let panSlider = document.getElementById(channel.index + "Pan");
		panSlider.addEventListener("input", function(){
			let pan = panSlider.value;
			channel.pan = pan;
			
			let panDisplay = document.getElementById(channel.index + "PanDisplay");
			panDisplay.innerHTML = pan;
			
			//use pan.set 
			
			channel.panNode.pan.value = pan / 50;
			
		});
		
		//name change on name click
		let chNameTag = document.getElementById(channel.index + "Name");
		let seqNameTag = document.getElementById(channel.index + "SeqNameLabel");
		
		chNameTag.addEventListener("click", function(){
			var newName = prompt("Enter channel name:");
			chNameTag.innerHTML = newName;		
			seqNameTag.innerHTML = newName;
				
			channel.name = newName;			
		});
		
		seqNameTag.addEventListener("dblclick", function(){
			var newName = prompt("Enter channel name:");
			chNameTag.innerHTML = newName;		
			seqNameTag.innerHTML = newName;
				
			channel.name = newName;				
		});
		
		//show effects on div click
		var channelDiv = document.getElementById(channel.index);
		
		channelDiv.addEventListener("dblclick", function(){	
			let effectsDiv = document.getElementById(channel.index + "EffectsDiv");
			
			if (channel.effectsShowing === false){
				channel.effectsShowing = true;
				effectsDiv.style.display = "block";			
			}	else {		
				channel.effectsShowing = false;
				effectsDiv.style.display = "none";
			}
		});
		
		//call effects event listeners
		channel.effects.startEventListeners();
	}
	
	//add notes to the array
	this.changeNote = function(stepIndex, note){
		channel.noteArray[stepIndex] = note;

		channel.sequence.dispose();

		if (playing === true){
			Tone.Transport.stop();
		}	
		
		channel.sequence = new Tone.Sequence(function(time, note) {
			channel.synth.triggerAttackRelease(note,"8n");
		}, channel.noteArray, "8n");		
		channel.sequence.start();
		
		if (playing === true){
			Tone.Transport.start();
		}
	};
	
	//funtion to connect or disconnect the node, returns the new state of whether its connected or not
	this.addRemoveNode = function(node, nodeIndex, isConnected){
        var pre;

		if(isConnected === false){
			//get final node in array (array.length is node new position before it gets pushed)
			pre = channel.nodeArray[channel.nodeArray.length - 1];	
						
			//separate end node from master
			pre.disconnect(Tone.Master);
			
			//connect pre to new node
			pre.connect(node);
			
			//connect new node to master
			node.toMaster();
			
			nodeIndex = channel.nodeArray.length;
			//add new node to array
			channel.nodeArray.push(node);
			
			return nodeIndex;
		} else {		
			pre = channel.nodeArray[(nodeIndex - 1)];
			var post;
			
			if (nodeIndex === channel.nodeArray.length - 1){
				post = Tone.Master;
			} else {
				post = channel.nodeArray[nodeIndex + 1];
			}
			
			//separate from pre and post
			pre.disconnect(node);
			node.disconnect(post);
		
			//remove from array splice leave no "holes" and dispose node
			channel.nodeArray.splice(nodeIndex, 1);
			
			//connect pre and post
			pre.connect(post);
			
			return -1;
		}
	};
}

//instantiate new step object (individual steps for each channel)
function stepObj(channel, stepNo){
	this.index = stepNo;
	this.channelIndex = channel.index;
	this.active = false;
	this.value = null;
	var step = this;
	
	channel.changeNote(step.index, step.value);
	
	this.click_EventHandler = function(){
		var stepButton = document.getElementById(step.channelIndex + "step" + step.index);
		
		stepButton.addEventListener("click",function(){
			if (step.active === false){
				stepButton.src = "resources/padOn.png";
				step.active = true;
				step.value = "c4";
				channel.changeNote(step.index, step.value);
			} else {
				stepButton.src = "resources/pad.png";
				step.active = false;
				step.value = null;
				channel.changeNote(step.index, step.value);
			}			
		});
	}
}

//effects object
function effectsObj(channel){
	var effects = this;
	
	//create array of effects
	var arr = [];
	this.effectsArray = arr;
	
	//reverb
	this.reverb = new reverbObj(channel);
    effects.effectsArray.push(effects.reverb);
    //delay
    this.delay = new reverbObj(channel);
    //effects.effectsArray.push(effects.delay);
	
	//starts all event listeners for each effect
	this.startEventListeners = function(){
		for(i = 0; i < effects.effectsArray.length; i++){
			var effect = effects.effectsArray[i];
			for(i = 0; i < effect.listenerArray.length; i++){
				effect.listenerArray[i]();
			}
		}
	}
}

//reverb object
function reverbObj(channel){
	//reverb node
	var my = this;
	this.reverbConnected = false;
	this.reverbRoomSize = 0.3;
	this.reverbDampening = 3000;
	this.reverbIndex;
	this.reverb = new Tone.Freeverb(my.reverbRoomSize, my.reverbDampening);
    this.name = "Reverb";

    var arr1 = [];
    this.parameterArray = arr1;

	var arr2 = [];
	this.listenerArray = arr2;
	
	//event listener for reverb slider
    this.sliderReverbRoomSize_EventHandler = function () {
        let reverbRoomSizeSlider = document.getElementById(channel.index + "ReverbRoomSizeSlider");

        reverbRoomSizeSlider.addEventListener("input", function () {
            //get slider value and set variable
            my.reverbRoomSize = reverbRoomSizeSlider.value / 100;

            //change reverb display text		
            let reverbRoomSizeDisplay = document.getElementById(channel.index + "ReverbRoomSizeDisplay");
            reverbRoomSizeDisplay.innerHTML = my.reverbRoomSize;

            if (my.reverbConnected === true) {
                my.reverb.roomSize.value = my.reverbRoomSize;
            }
        });
    };
    my.listenerArray.push(my.sliderReverbRoomSize_EventHandler);
    var roomSizeInfo = new parameterValueObj("Room Size", "ReverbRoomSize", 0, 100, my.reverbRoomSize, my.reverbRoomSize * 100);
    my.parameterArray.push(roomSizeInfo);

	//event listener for reverb dampening
    this.sliderReverbDampening_EventHandler = function () {
        let reverbDampeningSlider = document.getElementById(channel.index + "ReverbDampeningSlider");

        reverbDampeningSlider.addEventListener("input", function () {
            //get slider value and set variable
            my.reverbDampening = Math.pow(reverbDampeningSlider.value, 2);

            //change display text
            let reverbDampeningDisplay = document.getElementById(channel.index + "ReverbDampeningDisplay");
            reverbDampeningDisplay.innerHTML = my.reverbDampening;

            if (my.reverbConnected === true) {
                my.reverb.dampening.value = my.reverbDampening;
            }
        });
    };
	my.listenerArray.push(my.sliderReverbDampening_EventHandler);
    var dampeningInfo = new parameterValueObj("Dampening", "ReverbDampening", 0, 100, my.reverbDampening, Math.sqrt(my.reverbDampening));
    my.parameterArray.push(dampeningInfo);

	//event listener for cconnect/disconnect button
    this.btnReverb_EventHandler = function () {
        let btnReverbConnect = document.getElementById(channel.index + "btnReverb");
        btnReverbConnect.addEventListener("click", function () {

            //checks whether connected or not then connects or disconnects. returns whether node is now connected
            my.reverbIndex = channel.addRemoveNode(my.reverb, my.reverbIndex, my.reverbConnected);

            //change button text 
            if (my.reverbConnected === false) {
                btnReverbConnect.value = "Disconnect";
                my.reverbConnected = true;
            } else {
                btnReverbConnect.value = "Connect";
                my.reverbConnected = false;
            }
        });
    };
    my.listenerArray.push(my.btnReverb_EventHandler);

}

//delay object
function delayObj(channel){
    var my = this;

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
	if(newChannelName.length === 0){
		let channelNo = channelIndex + 1;
		newChannelName = "ch: " + channelNo;
	}

	let newChannel = new channelObj(newChannelName, 0.0, 0.0, channelIndex);
	mixingDeskArray.push(newChannel);
	drawChannel(newChannel);
	drawSequencer(newChannel);
	drawEffects(newChannel);
	
	//need to call these after draw as the html elements dont exist yet 
	//change to newChannel.startEventListeners
	newChannel.startEventListeners();
}

function play(){
	Tone.Transport.start();
	playing = true;
}

function pause(){
	Tone.Transport.stop();
	playing = false;
}

function remove(string, oldIndex, newIndex){
	document.getElementById(oldIndex + string).id = newIndex + string;
}

function parameterValueObj(Name, idName, min, max, defaultValue, sliderValue) {
    this.name = Name;
    this.idName = idName;
    this.min = min;
    this.max = max;
    this.defaultValue = defaultValue;
    this.sliderValue = sliderValue;
}

//misc event handlers

//master volume change
masterVolSlider.addEventListener("input", function(){
	var masterVol = masterVolSlider.value;
	masterVolDisplay.innerHTML = masterVol;
	
	Tone.Master.volume.value = masterVol;
});

//spacebar press plays and pauses
document.body.onkeyup = function(e){
    if (e.keyCode === 32) {
        if (playing === false){
        play();
        } else {
        pause();
        }
    }
}