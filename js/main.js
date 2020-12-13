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
function drawSequencer(channel) {
    //container
    var sequencersContainer = document.getElementById('sequencersContainer');

    var sequencerAndSynthDiv = document.createElement('div');
    sequencerAndSynthDiv.id = channel.index + "SeqAndSynthDiv";
    sequencersContainer.appendChild(sequencerAndSynthDiv);

	var seqDiv = document.createElement('div');
    seqDiv.classList.add("row");
    seqDiv.classList.add("seqDiv")
	seqDiv.id = channel.index + "Seq";
    sequencerAndSynthDiv.appendChild(seqDiv);
	
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

    //synth information div
    var synthInfoDiv = document.createElement('div');
    synthInfoDiv.id = channel.index + "SynthInfoDiv";
    synthInfoDiv.style.display = "none";
    sequencerAndSynthDiv.appendChild(synthInfoDiv);

    //drop down
    var synthDropDown = document.createElement('select');
    synthDropDown.id = channel.index + "SynthDropDown";
    synthInfoDiv.appendChild(synthDropDown);

    //create dropdown components from synth array
    for (i = 0; i < channel.synthArray.length; i++) {
        var synth = channel.synthArray[i];
        var option = document.createElement('option');
        option.innerHTML = synth.name;
        synthDropDown.appendChild(option);
    }

    //call function that will show default synths options menu
    channel.source.add();

    //create sampler 
}

function drawEffects(channel){
    var container = document.getElementById(channel.index + 'EffectsDiv');
    var effectsArray = channel.effects.effectsArray;

    for (i = 0; i < effectsArray.length; i++) {
        var effect = effectsArray[i];

        var effectDiv = document.createElement('div');
        effectDiv.id = effect.name + "Div";
        effectDiv.classList.add("effectDiv");
        container.appendChild(effectDiv);

        //create label
        var effectLabel = document.createElement('p');
        effectLabel.innerHTML = effect.name;
        effectDiv.appendChild(effectLabel);

        //create label, slider and display for each parameter of effect
        var parameterArray = effect.parameterArray;

        for (n = 0; n < parameterArray.length; n++) {
            var parameter = parameterArray[n];

            var parameterLabel = document.createElement('p');
            parameterLabel.innerHTML = parameter.name;
            effectDiv.appendChild(parameterLabel);

            var parameterSlider = document.createElement('input');
            parameterSlider.type = "range";
            parameterSlider.min = parameter.min;
            parameterSlider.max = parameter.max;
            parameterSlider.value = parameter.sliderValue;
            parameterSlider.id = channel.index + parameter.idName + "Slider";
            effectDiv.appendChild(parameterSlider);

            var parameterDisplay = document.createElement('p');
            parameterDisplay.innerHTML = parameter.defaultValue;
            parameterDisplay.id = channel.index + parameter.idName + "Display";
            effectDiv.appendChild(parameterDisplay);
        }

        //create button
        var effectButton = document.createElement('input');
        effectButton.type = "button";
        effectButton.value = "connect";
        effectButton.id = channel.index + "btn" + effect.name;
        effectButton.classList.add("button");
        effectDiv.appendChild(effectButton);
    }
}

//instantiate new channel object
function channelObj(chName, chVolume, chPan, chIndex){
	this.name = chName;
	this.pan = chPan;
	this.volume = chVolume;
	this.index = chIndex;
    this.muted = false;
    this.synthInfoShowing = false;
	this.effectsShowing = false;
	var nodeArr = []; //node array is an array of objects that contain the tone nodes as .node
	this.nodeArray = nodeArr;
	var channel = this;

	var arr1 = [];
	this.stepArray = arr1;
    var arr2 = [null,null,null,null,null,null,null,null];
	this.noteArray = arr2;

    var arr3 = [];
    this.synthArray = arr3;

    channel.synthArray.push(new synth(channel, 0));//0
    channel.synthArray.push(new AMSynth(channel, 1));
    channel.synthArray.push(new duoSynth(channel, 2));
    channel.synthArray.push(new FMSynth(channel, 3));
    channel.synthArray.push(new membraneSynth(channel, 4));
    channel.synthArray.push(new pluckSynth(channel, 5));
    channel.synthArray.push(new polySynth(channel, 6));
    channel.synthArray.push(new sampler(channel, 7));//7

	//SYNTH AND SEQUENCE
	
	//create synth node, add to array
    this.source = channel.synthArray[0];
	channel.nodeArray.push(channel.source);
	
	//create pan node, add to array
	this.panNode = new pan(channel);
	channel.nodeArray.push(channel.panNode);
	
	//connect synth to pan
	channel.source.node.connect(channel.panNode.node);
	
	//apply final node in array to master
	channel.nodeArray[channel.nodeArray.length - 1].node.toMaster();
	
	//create sequence for synth from array
	this.sequence = new Tone.Sequence(function(time, note) {
		channel.source.node.triggerAttackRelease(note,"8n");
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
				channel.source.node.volume.value = channel.volume;
			}			
		});
		
		//remove channel button
		let btnRemove = document.getElementById(channel.index + "Remove");
		btnRemove.addEventListener("click", function(){
			
			//delete channels div
			var channelContainer = document.getElementById(channel.index + "Container");
			channelContainer.remove();
			
            var sequencerAndSynthDiv = document.getElementById(channel.index + "SeqAndSynthDiv");
            sequencerAndSynthDiv.remove();
			
            channel.source.node.dispose();
            channel.panNode.node.dispose();
            var effectsArray = channel.effects.effectsArray;
            for (i = 0; i > effectsArray.length; i++) {
                var effectObj = effectsArray[i];
                var effectNode = effectObj.node;

                effectNode.dispose();
            }
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
                remove("SeqAndSynthDiv", _channel.index, i);
				remove("Seq", _channel.index, i);
				remove("SeqNameDiv", _channel.index, i);
                remove("SeqNameLabel", _channel.index, i);
                remove("SynthInfoDiv", _channel.index, i);
                remove("SynthDropDown", _channel.index, i);
				
				for(n = 0; n < 8; n++){
                    remove("step" + n, _channel.index, i);
				}
				
				//change effects containers ids
                remove("EffectsDiv", _channel.index, i);
                var effectsArray = channel.effects.effectsArray;
                //for every effect in effects array
                for (a = 0; a < effectsArray.length; a++) {
                    var effect = effectsArray[a];
                    var parameterArray = effect.parameterArray;
                    //for every parameter of effect
                    for (b = 0; b < parameterArray.length; b++) {
                        var parameter = parameterArray[b];
                        remove(parameter.idName + "Slider", _channel.index, i);
                        remove(parameter.idName + "Display", _channel.index, i);
                    }
                    //shift connect button
                    remove("btn" + effect.name, _channel.index, i);
                }
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
				
				channel.source.node.volume.value = -100;
			} else{
				channel.muted = false;
				volumeDisplay.innerHTML = channel.volume;
				
				channel.source.node.volume.value = channel.volume;
			}
		});
		
		//pan slider
		let panSlider = document.getElementById(channel.index + "Pan");
		panSlider.addEventListener("input", function(){
			let pan = panSlider.value;
			channel.pan = pan;
			
			let panDisplay = document.getElementById(channel.index + "PanDisplay");
			panDisplay.innerHTML = pan;
			
			channel.panNode.node.pan.value = pan / 50;
			
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
		
		seqNameTag.addEventListener("click", function(){
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

        //show synth settings
        var seqDiv = document.getElementById(channel.index + "Seq");
        seqDiv.addEventListener("dblclick", function () {
            var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");

            if (channel.synthInfoShowing === false) { 
                synthInfoDiv.style.display = "block";
                channel.synthInfoShowing = true;
            } else {
                synthInfoDiv.style.display = "none";
                channel.synthInfoShowing = false;
            }
        });

        //change synth
        var synthDropDown = document.getElementById(channel.index + "SynthDropDown");
        synthDropDown.addEventListener("input", function () {
            var newSynthName = synthDropDown.options[synthDropDown.selectedIndex].text;
            var synth;
            for (i = 0; i < channel.synthArray.length; i++) {
                var test = channel.synthArray[i];
                if (test.name == newSynthName) {
                    synth = test;
                    i = channel.synthArray.length;
                }
            }
            channel.source.node.disconnect(channel.panNode.node);
            channel.source.remove();
            synth.node.connect(channel.panNode.node);
            synth.add();

            channel.source = synth;
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
			channel.source.node.triggerAttackRelease(note,"8n");
		}, channel.noteArray, "8n");		
		channel.sequence.start();
		
		if (playing === true){
			Tone.Transport.start();
		}
	};
	
	//funtion to connect or disconnect the node, returns the new state of whether its connected or not
	this.addRemoveNode = function(effect){
        var pre;

        var node = effect.node;
        var nodeIndex = effect.index;
        var isConnected = effect.connected;

		if(isConnected === false){
			//get final node in array (array.length is node new position before it gets pushed)
			preObj = channel.nodeArray[channel.nodeArray.length - 1];	

            pre = preObj.node;

			//separate end node from master
			pre.disconnect(Tone.Master);
			
			//connect pre to new node
			pre.connect(node);
			
			//connect new node to master
			node.toMaster();
			
			nodeIndex = channel.nodeArray.length;
			//add new node to array
			channel.nodeArray.push(effect);
			
			return nodeIndex;
		} else {		
            preObj = channel.nodeArray[(nodeIndex - 1)];
            pre = preObj.node;

			var post;
			
			if (nodeIndex === channel.nodeArray.length - 1){
                post = Tone.Master;
                
			} else {
                var postObj = channel.nodeArray[nodeIndex + 1];
                post = postObj.node;
                postObj.index = postObj.index - 1;
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
    this.delay = new delayObj(channel);
    effects.effectsArray.push(effects.delay);
    //chorus
    this.AutoPanner = new autoPannerObj(channel);
    effects.effectsArray.push(effects.AutoPanner);
	
	//starts all event listeners for each effect
	this.startEventListeners = function(){
		for(i = 0; i < effects.effectsArray.length; i++){
            var effect = effects.effectsArray[i];
			for(n = 0; n < effect.listenerArray.length; n++){
                var listener = effect.listenerArray[n];
                listener.start();
			}
		}
	}
}

//reverb object
function reverbObj(channel){
	//reverb node
	var my = this;
	this.connected = false;
	this.reverbRoomSize = 0.3;
	this.reverbDampening = 3000;
	this.Index;
	this.node = new Tone.Freeverb(my.reverbRoomSize, my.reverbDampening);
    this.name = "Reverb";

    var arr1 = [];
    this.parameterArray = arr1;

	var arr2 = [];
	this.listenerArray = arr2;

    //room size
    //set and send default parameter data to parameter array
    var roomSizeInfo = new parameterInfoObj("Room Size", "ReverbRoomSize", 0, 100, my.reverbRoomSize, 100);
    my.parameterArray.push(roomSizeInfo);
	//event listener for room size
    this.sliderReverbRoomSize_EventHandler = new sliderListener(roomSizeInfo, my.node.roomSize, channel);
    my.listenerArray.push(my.sliderReverbRoomSize_EventHandler);

    //dampening
    //set and send default parameter data to parameter array
    var dampeningInfo = new parameterInfoObj("Dampening", "ReverbDampening", 0, 5000, my.reverbDampening, 1);
    my.parameterArray.push(dampeningInfo);
	//event listener for reverb dampening
    this.sliderReverbDampening_EventHandler = new sliderListener(dampeningInfo, my.node.dampening, channel);
    my.listenerArray.push(my.sliderReverbDampening_EventHandler);
    
	//event listener for cconnect/disconnect button
    this.btnReverb_EventHandler = new effectButtonListener(my, channel);
    my.listenerArray.push(my.btnReverb_EventHandler);

}

//delay object
function delayObj(channel){
    var my = this;
    this.connected = false;
    this.index;
    this.delayTime = 0.1;
    this.feedback = 0.5;
    this.node = new Tone.FeedbackDelay(my.delayTime, my.feedback);
    this.name = "Delay";

    var arr1 = [];
    this.parameterArray = arr1;

    var arr2 = [];
    this.listenerArray = arr2;

    //delay time
    //set and send default parameter data to parameter array
    var delayTimeInfo = new parameterInfoObj("Delay Time", "DelayDelayTime", 0, 100, my.delayTime, 100);
    my.parameterArray.push(delayTimeInfo);
    //listener for delay time
    this.delayTimeSlider_EventHandler = new sliderListener(delayTimeInfo, my.node.delayTime, channel);
    my.listenerArray.push(my.delayTimeSlider_EventHandler);

    //feedback
    var feedbackInfo = new parameterInfoObj("Feedback", "DelayFeedback", 0, 100, my.feedback, 100);
    my.parameterArray.push(feedbackInfo);
    this.delayFeedbackSlider_EventHandler = new sliderListener(feedbackInfo, my.node.feedback, channel);
    my.listenerArray.push(my.delayFeedbackSlider_EventHandler);

    //connect/disconect button
    this.btnDelay_EventHandler = new effectButtonListener(my, channel);
    my.listenerArray.push(my.btnDelay_EventHandler);
}

//auto panner
function autoPannerObj(channel){
    var my = this;
    this.connected = false;
    this.index;
    this.name = "Auto Panner";
    this.frequency = 300;
    this.node = new Tone.AutoPanner(my.frequency);

    var arr1 = [];
    this.parameterArray = arr1;

    var arr2 = [];
    this.listenerArray = arr2;

    //frequency
    var frequencyInfo = new parameterInfoObj("Frequency", "AutoPannerFrequency", 0, 5000, my.frequency, 1);
    my.parameterArray.push(frequencyInfo);
    this.autoPannerFrequencySlider_EventHandler = new sliderListener(frequencyInfo, my.node.frequency, channel);
    my.listenerArray.push(my.autoPannerFrequencySlider_EventHandler);

    //connect buitton
    my.connectButton_EventHandler = new effectButtonListener(my, channel);
    my.listenerArray.push(my.connectButton_EventHandler);
}


//synth objects
function synth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Normal Synth";
    this.node = new Tone.Synth();
    my.node.volume.value = channel.volume;

    this.testP;

    this.add = function () {
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        var testP = document.createElement('p');
        testP.innerHTML = my.name;
        synthInfoDiv.appendChild(testP);
        my.testP = testP;
    };

    this.remove = function () {
        my.testP.remove();
    };
}

function AMSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "AMSynth";
    this.node = new Tone.AMSynth();
    my.node.volume.value = channel.volume;

    this.testP;

    this.add = function () {
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        var testP = document.createElement('p');
        testP.innerHTML = my.name;
        synthInfoDiv.appendChild(testP);
        my.testP = testP;
    };

    this.remove = function () {
        my.testP.remove();
    };
}

function duoSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "duoSynth";
    this.node = new Tone.DuoSynth();
    my.node.volume.value = channel.volume;

    this.testP;

    this.add = function () {
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        var testP = document.createElement('p');
        testP.innerHTML = my.name;
        synthInfoDiv.appendChild(testP);
        my.testP = testP;
    };

    this.remove = function () {
        my.testP.remove();
    };
}

function FMSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "FMSynth";
    this.node = new Tone.FMSynth();
    my.node.volume.value = channel.volume;

    this.testP;

    this.add = function () {
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        var testP = document.createElement('p');
        testP.innerHTML = my.name;
        synthInfoDiv.appendChild(testP);
        my.testP = testP;
    };

    this.remove = function () {
        my.testP.remove();
    };
}

function membraneSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Membrane Synth";
    this.node = new Tone.MembraneSynth();
    my.node.volume.value = channel.volume;

    this.testP;

    this.add = function () {
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        var testP = document.createElement('p');
        testP.innerHTML = my.name;
        synthInfoDiv.appendChild(testP);
        my.testP = testP;
    };

    this.remove = function () {
        my.testP.remove();
    };
}

function pluckSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Pluck Synth";
    this.node = new Tone.PluckSynth();
    my.node.volume.value = channel.volume;

    this.testP;

    this.add = function () {
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        var testP = document.createElement('p');
        testP.innerHTML = my.name;
        synthInfoDiv.appendChild(testP);
        my.testP = testP;
    };

    this.remove = function () {
        my.testP.remove();
    };
}

function polySynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Poly Synth";
    this.node = new Tone.PolySynth();
    my.node.volume.value = channel.volume;

    this.testP;

    this.add = function () {
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        var testP = document.createElement('p');
        testP.innerHTML = my.name;
        synthInfoDiv.appendChild(testP);
        my.testP = testP;
    };

    this.remove = function () {
        my.testP.remove();
    };
}

//sampler
function sampler(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Sampler";
    this.node = new Tone.Sampler();
    my.node.volume.value = channel.volume;

    this.sampleButton;

    this.add = function () {
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        var sampleButton = document.createElement('input');
        sampleButton.type = "button";
        sampleButton.classList.add("button");
        sampleButton.value = "Choose Sample";
        synthInfoDiv.appendChild(sampleButton);
        my.sampleButton = sampleButton;
        my.btnChangeSample_EventHandler();
    };

    this.remove = function () {
        my.sampleButton.remove();
    };

    this.btnChangeSample_EventHandler = function () {
        my.sampleButton.addEventListener("click", function () {
            console.log("input sample");
        });
    };
}

//pan controller obj
function pan(channel) {
    my = this;
    this.index;
    this.node = new Tone.PanVol(channel.pan, 0);
}

//object containing parameter info names vlaues ect
function parameterInfoObj(Name, idName, min, max, defaultValue, divider) {
    my = this;
    this.name = Name;
    this.idName = idName;
    this.min = min;
    this.max = max;
    this.defaultValue = defaultValue;
    this.value = defaultValue
    this.divider = divider;
    this.sliderValue = my.defaultValue * my.divider;
}

//object containing method for initiating slider listeners
function sliderListener(parameterObj, nodeParameter, channel) {

    this.start = function () {
        var slider = document.getElementById(channel.index + parameterObj.idName + "Slider");
        slider.addEventListener("input", function () {
            var val = slider.value;

            parameterObj.value = val / parameterObj.divider;

            var display = document.getElementById(channel.index + parameterObj.idName + "Display");
            display.innerHTML = parameterObj.value;

            nodeParameter.value = parameterObj.value;
        });
    };
}

//object containing method for initiating effect connect button listener
function effectButtonListener(effect, channel) {

    this.start = function () {
        var button = document.getElementById(channel.index + "btn" + effect.name);
		button.addEventListener("click", function () {

            effect.index = channel.addRemoveNode(effect);

            //change button text 
            if (effect.connected === false) {
                button.value = "Disconnect";
                effect.connected = true;
            } else {
                button.value = "Connect";
                effect.connected = false;
            }
        });
    };
}


//add channel to channel list and draw it
function addChannel() {
    let newChannelName = prompt("New Channel Name");

    //creating new channel object and adding to array
    let channelIndex = mixingDeskArray.length;

    //validation (object doesnt like not having a name :( )
    if (newChannelName.length === 0) {
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

function play() {
    Tone.Transport.start();
    playing = true;
}

function pause() {
    Tone.Transport.stop();
    playing = false;
}

function remove(string, oldIndex, newIndex) {
    document.getElementById(oldIndex + string).id = newIndex + string;
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
		e.preventDefault();
        if (playing === false){
        play();
        } else {
        pause();
        }
    }
}