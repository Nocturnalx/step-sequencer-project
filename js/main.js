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

//tempo display
var tempoDisplay = document.getElementById('tempoDisplay');
tempoDisplay.innerHTML = Tone.Transport.bpm.value;
tempoDisplay.style.cursor = "text";
tempoDisplay.addEventListener("click", inputTempo);

//tempo slider
var tempoControlSlider = document.getElementById('tempoControl');
tempoControlSlider.value = Tone.Transport.bpm.value;
tempoControlSlider.addEventListener("input", changeTempo);

//~~functions~~

//function draws elements for a given channel
function drawChannel(channel){
	//desk div in body
	var desk = document.getElementById('desk'); 
	
	//container for channel div and hidden effects div
	var channelContainer = document.createElement('div');
	channelContainer.id = channel.index + "Container";
	channelContainer.classList.add("row");
    channelContainer.classList.add("channelContainer");
	desk.appendChild(channelContainer);

	//CHANNEL DIV
	
	//create div for channel
	var channelDiv = document.createElement('div');
	channelDiv.classList.add("col");
	channelDiv.classList.add("channelDiv");
	channelDiv.id = channel.index;
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
	volumeSlider.max = 20;
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
        var step = new stepObj(channel, i);
        channel.stepArray.push(step);

        var container = document.createElement('div');
        container.classList.add("textContainer");
        container.id = step.channelIndex + "Step" + step.index;
        seqDiv.appendChild(container);

		//draw each step for channel
		var btnStep = document.createElement('img');		
		btnStep.classList.add("step");			
		btnStep.src = "resources/pad.png";	
		btnStep.id = step.channelIndex + "StepImg" + step.index;		
		container.appendChild(btnStep);

        var noteDisplay = document.createElement('div');
        noteDisplay.classList.add("centeredText");
        noteDisplay.innerHTML = step.note;
        noteDisplay.id = step.channelIndex + "StepNoteDisplay" + step.index;
        container.appendChild(noteDisplay);

		step.startEventListeners();
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

    var colorPicker = document.createElement('input');
    colorPicker.type = "color";
    colorPicker.id = channel.index + "ColorPicker";
    synthInfoDiv.appendChild(colorPicker);

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

function drawSynthInfoValues(channel) {
    var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");

    var sliderDiv = document.createElement('div');
    sliderDiv.id = channel.index + "SliderDiv";
    sliderDiv.classList.add("row");
    synthInfoDiv.appendChild(sliderDiv);

    var parameterArray = channel.source.parameterArray;

    for (i = 0; i < parameterArray.length; i++) {
        var parameter = parameterArray[i];

        var parameterDiv = document.createElement('div');
        parameterDiv.id = "parameterDiv";
        parameterDiv.classList.add("parameterDiv");
        sliderDiv.appendChild(parameterDiv);

        var label = document.createElement('p');
        label.innerHTML = parameter.name;
        parameterDiv.appendChild(label);

        var parameterSlider = document.createElement('input');
        parameterSlider.type = "range";
        parameterSlider.id = channel.index + parameter.idName + "Slider";
        parameterSlider.min = parameter.min;
        parameterSlider.max = parameter.max;
        parameterSlider.value = parameter.sliderValue;
        parameterDiv.appendChild(parameterSlider);

        var display = document.createElement('p');
        display.id = channel.index + parameter.idName + "Display";
        display.innerHTML = parameter.defaultValue;
        parameterDiv.appendChild(display);
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

	var stepArr = [];
	this.stepArray = stepArr;
    var noteArr = [null,null,null,null,null,null,null,null];
	this.noteArray = noteArr;

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

    //create amp node, add to array
    this.ampEnvelope = new ampEnvelope(channel);
    channel.nodeArray.push(channel.ampEnvelope);

	//create pan node, add to array
	this.panNode = new pan(channel);
	channel.nodeArray.push(channel.panNode);

	//connect synth to env then env to pan
    channel.source.node.chain(channel.ampEnvelope.node, channel.panNode.node)

	//apply final node in array to master
    channel.nodeArray[channel.nodeArray.length - 1].node.toMaster();

	//create sequence for synth from array
    this.sequence = new Tone.Sequence( function (time, note) {
            channel.source.node.triggerAttackRelease(note, "8n");
            channel.ampEnvelope.node.triggerAttackRelease("8n");
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
                    remove("Step" + n, _channel.index, i);
                    remove("StepImg" + n, _channel.index, i);
                    remove("StepNoteDisplay" + n, _channel.index, i);
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

                //swap slider div id
                remove("SliderDiv", _channel.index, i);
                //swap colour selector id
                remove("ColorPicker", _channel.index, i);

                var synthParameterArray = channel.source.parameterArray;
                for (x = 0; x < synthParameterArray.length; x++) {
                    var parameter = synthParameterArray[x];
                    remove(parameter.idName + "Slider", _channel.index, i);
                    remove(parameter.idName + "Display", _channel.index, i);
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
            if (!(newName == "")) {
                chNameTag.innerHTML = newName;
                seqNameTag.innerHTML = newName;

                channel.name = newName;
            }		
		});
		
		seqNameTag.addEventListener("click", function(){
			var newName = prompt("Enter channel name:");
            if (!(newName == "")) {
                chNameTag.innerHTML = newName;
                seqNameTag.innerHTML = newName;

                channel.name = newName;
            }			
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
            channel.source.node.disconnect(channel.ampEnvelope.node);
            channel.source.remove();
            synth.node.connect(channel.ampEnvelope.node);
            channel.source = synth;
            channel.source.add();            
        });

        //change color 
        var colorPicker = document.getElementById(channel.index + "ColorPicker");
        var channelContainer = document.getElementById(channel.index + "Container");
        colorPicker.addEventListener("input", function () {
            seqDiv.style.backgroundColor = colorPicker.value;
            channelContainer.style.backgroundColor = colorPicker.value;
        })

		//call effects event listeners
		channel.effects.startEventListeners();
	}
	
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
    this.note = "C4";
	var step = this;
	
    this.startEventListeners = function () {
        //get elements
		var stepButton = document.getElementById(step.channelIndex + "Step" + step.index);
        var stepImg = document.getElementById(step.channelIndex + "StepImg" + step.index);
        var stepNoteDisplay = document.getElementById(step.channelIndex + "StepNoteDisplay" + step.index);

        //turn step on and off 
		stepButton.addEventListener("click",function(){
            if (step.active === false) {
				stepImg.src = "resources/padOn.png";
				step.active = true;
                stepButton.value = step.note; //(html button not stepObj)
                channel.sequence.at(step.index, step.note);
			} else {
                stepImg.src = "resources/pad.png";
				step.active = false;
                channel.sequence.remove(step.index);
			}
        });

        //change step's note
        stepButton.addEventListener("auxclick", function (e) {       
            if (e.button == 1) {
                var newNote = prompt("enter note");
                //if not empty
                if (!(newNote == "")) {
                    //length < 4 && 1st = musical note && (2nd = number || (2nd = # && 3rd = number);
                    var regexNum = /0|1|2|3|4|5|6|7|8|9/;
                    var regexStr = /A|B|C|D|E|F|G/i;
                    if (newNote.length < 4 && regexStr.test(newNote.split("")[0]) && (regexNum.test(newNote.split("")[1]) || (/#/.test(newNote.split("")[1]) && regexNum.test(newNote.split("")[2])))) {
                        step.note = newNote;
                        stepNoteDisplay.innerHTML = step.note;
                        if (step.active) {
                            channel.sequence.at(step.index, step.note);
                        }
                    } else {
                        console.log(newNote + ' is not a valid note, notes are to be input in the following notation: C4, A3, F#5...etc');
                    }
                }         
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
    //distortion
    this.distortion = new distortionObj(channel);
    effects.effectsArray.push(effects.distortion);
    //bit crusher
    this.bitCrusher = new bitCrusherObj(channel);
    effects.effectsArray.push(effects.bitCrusher);
	
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
    var roomSizeInfo = new parameterInfoObj("Room Size", "ReverbRoomSize", 0, 100, my.reverbRoomSize, 100, my.node.roomSize);
    my.parameterArray.push(roomSizeInfo);
	//event listener for room size
    this.sliderReverbRoomSize_EventHandler = new sliderListener(roomSizeInfo, channel);
    my.listenerArray.push(my.sliderReverbRoomSize_EventHandler);

    //dampening
    //set and send default parameter data to parameter array
    var dampeningInfo = new parameterInfoObj("Dampening", "ReverbDampening", 0, 5000, my.reverbDampening, 1, my.node.dampening);
    my.parameterArray.push(dampeningInfo);
	//event listener for reverb dampening
    this.sliderReverbDampening_EventHandler = new sliderListener(dampeningInfo, channel);
    my.listenerArray.push(my.sliderReverbDampening_EventHandler);
    
    //connect buitton
    my.connectButton_EventHandler = new effectButtonListener(my, channel);
    my.listenerArray.push(my.connectButton_EventHandler);

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
    var delayTimeInfo = new parameterInfoObj("Delay Time", "DelayDelayTime", 0, 100, my.delayTime, 100, my.node.delayTime);
    my.parameterArray.push(delayTimeInfo);
    //listener for delay time
    this.delayTimeSlider_EventHandler = new sliderListener(delayTimeInfo, channel);
    my.listenerArray.push(my.delayTimeSlider_EventHandler);

    //feedback
    var feedbackInfo = new parameterInfoObj("Feedback", "DelayFeedback", 0, 100, my.feedback, 100, my.node.feedback);
    my.parameterArray.push(feedbackInfo);
    this.delayFeedbackSlider_EventHandler = new sliderListener(feedbackInfo, channel);
    my.listenerArray.push(my.delayFeedbackSlider_EventHandler);

    //connect buitton
    my.connectButton_EventHandler = new effectButtonListener(my, channel);
    my.listenerArray.push(my.connectButton_EventHandler);
}

//Distortion
function distortionObj(channel) {
    var my = this;
    this.connected = false;
    this.index;
    this.name = "Distortion";
    this.distortion = 1;
    this.wet = 0.3;
    this.node = new Tone.Distortion({ "distortion": my.distortion });

    var arr1 = [];
    this.parameterArray = arr1;

    var arr2 = [];
    this.listenerArray = arr2;

    //frequency
    var distortionWetInfo = new parameterInfoObj("Distortion Wet", "DistortionWet", 0, 100, my.wet, 100, my.node.wet);
    my.parameterArray.push(distortionWetInfo);
    this.distortionWetSlider_EventHandler = new sliderListener(distortionWetInfo, channel);
    my.listenerArray.push(my.distortionWetSlider_EventHandler);

    //connect buitton
    my.connectButton_EventHandler = new effectButtonListener(my, channel);
    my.listenerArray.push(my.connectButton_EventHandler);
}

function bitCrusherObj(channel) {
    var my = this;
    this.connected = false;
    this.Index;
    this.wet = 0.8;
    this.node = new Tone.BitCrusher(4);
    this.name = "Bit Crusher";

    var arr1 = [];
    this.parameterArray = arr1;

    var arr2 = [];
    this.listenerArray = arr2;

    var wetInfo = new parameterInfoObj("Wet", "BitCrusherWet", 0, 100, my.wet, 100, my.node.wet);
    my.parameterArray.push(wetInfo);
    this.wetSlider_EventHandler = new sliderListener(wetInfo, channel);
    my.listenerArray.push(my.wetSlider_EventHandler);

    //connect buitton
    my.connectButton_EventHandler = new effectButtonListener(my, channel);
    my.listenerArray.push(my.connectButton_EventHandler);
}


//synth objects
function synth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Normal Synth";

    this.attack = 0.3;
    this.decay = 0.5;
    this.sustain = 0.7;
    this.release = 3;

    this.node = new Tone.Synth();
    my.node.volume.value = channel.volume;

    var arr = [];
    this.parameterArray = arr;

    this.add = function () {
        //adds ADSR parameter definitions to parameter array (sets parameter array 0-3 to attack, decay, sustain, release)
        addSynthADSR(my, channel);
        //draw sliders for synth parameters
        drawSynthInfoValues(channel);
        //set adsr values for amp envelope
        channel.ampEnvelope.node.attack = my.parameterArray[0].value;
        channel.ampEnvelope.node.decay = my.parameterArray[1].value;
        channel.ampEnvelope.node.sustain = my.parameterArray[2].value;
        channel.ampEnvelope.node.release = my.parameterArray[3].value;
        //create sliders
        addSynthListeners(my, channel);
    };

    this.remove = function () {
        //remove sliders div and set parameter array to nothing 
        var sliderDiv = document.getElementById(channel.index + "SliderDiv");
        sliderDiv.remove();
        my.parameterArray = [];
    };
}

function AMSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "AMSynth";

    this.attack = 0.3;
    this.decay = 0.5;
    this.sustain = 0.7;
    this.release = 3;

    this.node = new Tone.AMSynth();
    my.node.volume.value = channel.volume;

    var arr = [];
    this.parameterArray = arr;

    this.add = function () {
        //adds ADSR parameter definitions to parameter array (sets parameter array 0-3 to attack, decay, sustain, release)
        addSynthADSR(my, channel);
        //draw sliders for synth parameters
        drawSynthInfoValues(channel);
        //set adsr values for amp envelope
        channel.ampEnvelope.node.attack = my.parameterArray[0].value;
        channel.ampEnvelope.node.decay = my.parameterArray[1].value;
        channel.ampEnvelope.node.sustain = my.parameterArray[2].value;
        channel.ampEnvelope.node.release = my.parameterArray[3].value;
        //create sliders
        addSynthListeners(my, channel);
    };

    this.remove = function () {
        //remove sliders div and set parameter array to nothing 
        var sliderDiv = document.getElementById(channel.index + "SliderDiv");
        sliderDiv.remove();
        my.parameterArray = [];
    };
}

function duoSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "duoSynth";

    this.attack = 0.3;
    this.decay = 0.5;
    this.sustain = 0.7;
    this.release = 3;

    this.node = new Tone.DuoSynth();
    my.node.volume.value = channel.volume;

    var arr = [];
    this.parameterArray = arr;

    this.add = function () {
        //adds ADSR parameter definitions to parameter array (sets parameter array 0-3 to attack, decay, sustain, release)
        addSynthADSR(my, channel);
        //draw sliders for synth parameters
        drawSynthInfoValues(channel);
        //set adsr values for amp envelope
        channel.ampEnvelope.node.attack = my.parameterArray[0].value;
        channel.ampEnvelope.node.decay = my.parameterArray[1].value;
        channel.ampEnvelope.node.sustain = my.parameterArray[2].value;
        channel.ampEnvelope.node.release = my.parameterArray[3].value;
        //create sliders
        addSynthListeners(my, channel);
    };

    this.remove = function () {
        //remove sliders div and set parameter array to nothing 
        var sliderDiv = document.getElementById(channel.index + "SliderDiv");
        sliderDiv.remove();
        my.parameterArray = [];
    };
}

function FMSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "FMSynth";

    this.attack = 0.3;
    this.decay = 0.5;
    this.sustain = 0.7;
    this.release = 3;

    this.node = new Tone.FMSynth();
    my.node.volume.value = channel.volume;

    var arr = [];
    this.parameterArray = arr;

    this.add = function () {
        //adds ADSR parameter definitions to parameter array (sets parameter array 0-3 to attack, decay, sustain, release)
        addSynthADSR(my, channel);
        //draw sliders for synth parameters
        drawSynthInfoValues(channel);
        //set adsr values for amp envelope
        channel.ampEnvelope.node.attack = my.parameterArray[0].value;
        channel.ampEnvelope.node.decay = my.parameterArray[1].value;
        channel.ampEnvelope.node.sustain = my.parameterArray[2].value;
        channel.ampEnvelope.node.release = my.parameterArray[3].value;
        //create sliders
        addSynthListeners(my, channel);
    };

    this.remove = function () {
        //remove sliders div and set parameter array to nothing 
        var sliderDiv = document.getElementById(channel.index + "SliderDiv");
        sliderDiv.remove();
        my.parameterArray = [];
    };
}

function membraneSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Membrane Synth";

    this.attack = 0.3;
    this.decay = 0.5;
    this.sustain = 0.7;
    this.release = 3;

    this.node = new Tone.MembraneSynth();
    my.node.volume.value = channel.volume;

    var arr = [];
    this.parameterArray = arr;

    this.add = function () {
        //adds ADSR parameter definitions to parameter array (sets parameter array 0-3 to attack, decay, sustain, release)
        addSynthADSR(my, channel);
        //draw sliders for synth parameters
        drawSynthInfoValues(channel);
        //set adsr values for amp envelope
        channel.ampEnvelope.node.attack = my.parameterArray[0].value;
        channel.ampEnvelope.node.decay = my.parameterArray[1].value;
        channel.ampEnvelope.node.sustain = my.parameterArray[2].value;
        channel.ampEnvelope.node.release = my.parameterArray[3].value;
        //create sliders
        addSynthListeners(my, channel);
    };

    this.remove = function () {
        //remove sliders div and set parameter array to nothing 
        var sliderDiv = document.getElementById(channel.index + "SliderDiv");
        sliderDiv.remove();
        my.parameterArray = [];
    };
}

function pluckSynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Pluck Synth";

    this.attack = 0.3;
    this.decay = 0.5;
    this.sustain = 0.7;
    this.release = 3;

    this.node = new Tone.PluckSynth();
    my.node.volume.value = channel.volume;

    var arr = [];
    this.parameterArray = arr;

    this.add = function () {
        //adds ADSR parameter definitions to parameter array (sets parameter array 0-3 to attack, decay, sustain, release)
        addSynthADSR(my, channel);
        //draw sliders for synth parameters
        drawSynthInfoValues(channel);
        //set adsr values for amp envelope
        channel.ampEnvelope.node.attack = my.parameterArray[0].value;
        channel.ampEnvelope.node.decay = my.parameterArray[1].value;
        channel.ampEnvelope.node.sustain = my.parameterArray[2].value;
        channel.ampEnvelope.node.release = my.parameterArray[3].value;
        //create sliders
        addSynthListeners(my, channel);
    };

    this.remove = function () {
        //remove sliders div and set parameter array to nothing 
        var sliderDiv = document.getElementById(channel.index + "SliderDiv");
        sliderDiv.remove();
        my.parameterArray = [];
    };
}

function polySynth(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Poly Synth";

    this.attack = 0.3;
    this.decay = 0.5;
    this.sustain = 0.7;
    this.release = 3;

    this.node = new Tone.PolySynth();
    my.node.volume.value = channel.volume;

    var arr = [];
    this.parameterArray = arr;

    this.add = function () {
        //adds ADSR parameter definitions to parameter array (sets parameter array 0-3 to attack, decay, sustain, release)
        addSynthADSR(my, channel);
        //draw sliders for synth parameters
        drawSynthInfoValues(channel);
        //set adsr values for amp envelope
        channel.ampEnvelope.node.attack = my.parameterArray[0].value;
        channel.ampEnvelope.node.decay = my.parameterArray[1].value;
        channel.ampEnvelope.node.sustain = my.parameterArray[2].value;
        channel.ampEnvelope.node.release = my.parameterArray[3].value;
        //create sliders
        addSynthListeners(my, channel);
    };

    this.remove = function () {
        //remove sliders div and set parameter array to nothing 
        var sliderDiv = document.getElementById(channel.index + "SliderDiv");
        sliderDiv.remove();
        my.parameterArray = [];
    };
}
//sampler
function sampler(channel, index) {
    var my = this;
    this.index = index;
    this.name = "Sampler";

    this.attack = 0.3;
    this.decay = 0.5;
    this.sustain = 0.7;
    this.release = 3;

    this.node = new Tone.Sampler();

    my.node.volume.value = channel.volume;

    var arr = [];
    this.parameterArray = arr;

    this.sampleButton;

    //draw info
    this.add = function () {
        //adds ADSR parameter definitions to parameter array (sets parameter array 0-3 to attack, decay, sustain, release)
        addSynthADSR(my, channel);
        //draw sliders for synth parameters
        drawSynthInfoValues(channel);
        //set adsr values for amp envelope
        channel.ampEnvelope.node.attack = my.parameterArray[0].value;
        channel.ampEnvelope.node.decay = my.parameterArray[1].value;
        channel.ampEnvelope.node.sustain = my.parameterArray[2].value;
        channel.ampEnvelope.node.release = my.parameterArray[3].value;
        //create sliders
        addSynthListeners(my, channel);

         //get synth info div
        var synthInfoDiv = document.getElementById(channel.index + "SynthInfoDiv");
        //button to add sample
        var sampleInput = document.createElement('input');
        sampleInput.type = "file";
        sampleInput.accept = ".mp3, .m4a, .wav, ";
        sampleInput.innerHTML = "Choose Sample";
        synthInfoDiv.appendChild(sampleInput);
        my.sampleButton = sampleInput;
        my.inputChangeSample_EventHandler();
    };

    //remove elements for this div
    this.remove = function () {
        //remove sliders div and set parameter array to nothing 
        var sliderDiv = document.getElementById(channel.index + "SliderDiv");
        sliderDiv.remove();
        my.parameterArray = [];

        //remove button
        my.sampleButton.remove();
    };

    //new sample button event handler
    this.inputChangeSample_EventHandler = function () {
        my.sampleButton.addEventListener("input", function (event) {
            var file = event.target.files[0];
            var reader = new FileReader();

            var fileString;

            reader.onload = function (event) {
                fileString = event.target.result;
                my.node.add("C4", fileString);
                my.node.debug = true;
            }
            
            reader.readAsDataURL(file);
        });
    };
}


//pan controller obj
function pan(channel) {
    my = this;
    this.index;
    this.node = new Tone.PanVol(channel.pan, 0);
}

//amplitude envelope
function ampEnvelope(channel) {
    my = this;
    this.index;
    this.node = new Tone.AmplitudeEnvelope();
}


//object containing parameter info names vlaues ect
function parameterInfoObj(Name, idName, min, max, defaultValue, divider, nodeParameter) {
    my = this;
    this.name = Name;
    this.idName = idName;
    this.min = min;
    this.max = max;
    this.defaultValue = defaultValue;
    this.value = defaultValue
    this.divider = divider;
    this.sliderValue = my.defaultValue * my.divider;
    my.nodeParameter = nodeParameter;
}

//object containing method for initiating slider listeners
function sliderListener(parameterObj, channel, addDotValue) {

    this.start = function () {
        var slider = document.getElementById(channel.index + parameterObj.idName + "Slider");
        slider.addEventListener("input", function () {
            var val = slider.value;

            parameterObj.value = val / parameterObj.divider;

            var display = document.getElementById(channel.index + parameterObj.idName + "Display");
            display.innerHTML = parameterObj.value;

            if (addDotValue === false) {
                parameterObj.nodeParameter = parameterObj.value;
            } else {
                parameterObj.nodeParameter.value = parameterObj.value;
            }
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

function addSynthADSR(synth) {
    //attack
    var attackObj = new parameterInfoObj("Attack", "Attack", 0, 200, synth.attack, 100);
    synth.parameterArray.push(attackObj);
    //decay
    var decayObj = new parameterInfoObj("Decay", "Decay", 0, 200, synth.decay, 100);
    synth.parameterArray.push(decayObj);
    //sustain
    var sustainObj = new parameterInfoObj("Sustain", "Sustain", 0, 100, synth.sustain, 100);
    synth.parameterArray.push(sustainObj);
    //release
    var releaseObj = new parameterInfoObj("Release", "Release", 1, 500, synth.release, 100);
    synth.parameterArray.push(releaseObj);
}

function addSynthListeners(synth, channel) {
    //attack listener
    var attackObj = synth.parameterArray[0];

    var attackSlider = document.getElementById(channel.index + attackObj.idName + "Slider");
    attackSlider.addEventListener("input", function () {
        var val = attackSlider.value;

        attackObj.value = val / attackObj.divider;

        var display = document.getElementById(channel.index + attackObj.idName + "Display");
        display.innerHTML = attackObj.value;

        channel.ampEnvelope.node.attack = attackObj.value;
        synth.attack = attackObj.value;
    });

    //decay listener
    var decayObj = synth.parameterArray[1];

    var decaySlider = document.getElementById(channel.index + decayObj.idName + "Slider");
    decaySlider.addEventListener("input", function () {
        var val = decaySlider.value;

        decayObj.value = val / decayObj.divider;

        var display = document.getElementById(channel.index + decayObj.idName + "Display");
        display.innerHTML = decayObj.value;

        channel.ampEnvelope.node.decay = decayObj.value;
        synth.decay = decayObj.value;
    });

    //sustain listener
    var sustainObj = synth.parameterArray[2];

    var sustainSlider = document.getElementById(channel.index + sustainObj.idName + "Slider");
    sustainSlider.addEventListener("input", function () {
        var val = sustainSlider.value;

        sustainObj.value = val / sustainObj.divider;

        var display = document.getElementById(channel.index + sustainObj.idName + "Display");
        display.innerHTML = sustainObj.value;

        channel.ampEnvelope.node.sustain = sustainObj.value;
        synth.sustain = sustainObj.value;
    });

    //release listener
    var releaseObj = synth.parameterArray[3];

    var releaseSlider = document.getElementById(channel.index + releaseObj.idName + "Slider");
    releaseSlider.addEventListener("input", function () {
        var val = releaseSlider.value;

        releaseObj.value = val / releaseObj.divider;

        var display = document.getElementById(channel.index + releaseObj.idName + "Display");
        display.innerHTML = releaseObj.value;

        channel.ampEnvelope.node.release = releaseObj.value;
        synth.release = releaseObj.value;
    });
};


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

function changeTempo() {
    Tone.Transport.bpm.value = tempoControlSlider.value;
    tempoDisplay.innerHTML = tempoControlSlider.value;
}

function inputTempo() {
    var tempo = prompt("Input Tempo");
    //is a number
    if (!(isNaN(tempo))) {
        //is in range
        if (tempo > 9 && tempo < 251) {
            Tone.Transport.bpm.value = tempo;
            tempoDisplay.innerHTML = tempo;
            tempoControlSlider.value = tempo;
        } else {
            console.log(tempo + " is not in range, range is 10 - 250")
        }
    } else {
        console.log(tempo + " is not a number");
    }
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