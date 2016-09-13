
//Audio recording check
function initAudio(index) {

  	var audioSource = index.value;
	var idconfirm = index.parentNode;
	var recordCloud = document.createElement('a');
	var audioRecorder = null;
	
	function gotStream(stream) {
			
		// Create an AudioNode from the stream.
		var realAudioInput = audioContext.createMediaStreamSource(stream);
		var audioInput = realAudioInput;
		
		var inputPoint = audioContext.createGain();
		inputPoint.gain.value = 1.0;
		audioInput.connect(inputPoint);
		
		var analyserNode = audioContext.createAnalyser();
		analyserNode.fftSize = 2048;
		inputPoint.connect( analyserNode );
		
		audioRecorder = new Recorder( inputPoint ); // this fuck what the fuck
		// speak / headphone feedback initial settings
		
		inputPoint.connect(audioContext.destination);
		return audioRecorder;
	}
	
	var constraints = {
		audio: { deviceId: audioSource ? {exact: audioSource} : undefined}
	};
	
	navigator.mediaDevices.getUserMedia(constraints)
	.then(gotStream)
	.then(function() { 
		idconfirm.src = audioRecorder;
	})
	.catch(handleError);
}

//input Device Check
function gotDevices(deviceInfos) {
	
	var masterInputSelector = document.createElement('select');
	
	for (var i = 0; i !== deviceInfos.length; ++i) {
		var deviceInfo = deviceInfos[i];
		var option = document.createElement('option');
		option.value = deviceInfo.deviceId;
		if (deviceInfo.kind === 'audioinput') {
			option.text = deviceInfo.label || 'microphone ' + (masterInputSelector.length + 1);
			masterInputSelector.appendChild(option);
		}
	}
	
	var audioInputSelect = document.querySelectorAll('select#device');
	for ( var selector = 0; selector < audioInputSelect.length; selector++) {
		var newInputSelector = masterInputSelector.cloneNode(true);
		newInputSelector.addEventListener('change', changeAudioDestination);
		audioInputSelect[selector].parentNode.replaceChild(newInputSelector, audioInputSelect[selector]);
	}
}

// function for many Selector Element 
function changeAudioDestination(event) {
	
	var InputSelector = event.path[0];
	initAudio(InputSelector);
}

// fail callback
function handleError(error) {
	
  console.log('navigator.getUserMedia error: ', error);
}

//Get Input Devices
//page load then Start function
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
