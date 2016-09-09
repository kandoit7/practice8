var audioContext = new (window.AudioContext || window.webkitAudioContext) ();

function allowDrop(ev) {
	ev.preventDefault();
}

//canvas drag & drop
function dropping(e) {
	e.preventDefault();
	
	var ctx = e.toElement.getContext('2d');
	var w = e.toElement.width;
	var h = e.toElement.height;
	
	//create audio node
	var source = audioContext.createBufferSource();
	var analyser = audioContext.createScriptProcessor(1024,1,1);
	
	//fill the canvas first
	ctx.fillStyle = '#EEEEE0';
	ctx.fillRect(0,0,w,h);
	
	
	//create the file reader to read the audio file dropped
	var reader = new FileReader();
	reader.onload = function(e){
		if(audioContext.decodeAudioData){
			//decode the audio data
			audioContext.decodeAudioData(e.target.result,function(buffer){
				source.buffer = buffer;
				drawBuffer(w, h, ctx, buffer.getChannelData(0));
			});
		} else {
			//fallback to the old API
			source.buffer = audioContext.createBuffer(e.target.result,true);
		}
		//connect to the destination and our analyser
		source.connect(audioContext.destination);
		source.connect(analyser);
		analyser.connect(audioContext.destination);
	}
	//read the file
	reader.readAsArrayBuffer(e.dataTransfer.files[0]);
	e.target.src = source;
}

//play
function Play(e) {
	if(!e.parentNode.nextElementSibling.src){
		console.log("no audio Source");
	} else {
		
		if(e.classList.contains("NoPlaying")){
			e.track = audioContext.createBufferSource();
			e.gainNode = audioContext.createGain();
			e.track.buffer = e.parentNode.nextElementSibling.src.buffer;
			e.track.connect(e.gainNode);
			e.gainNode.connect(audioContext.destination);
			e.classList.remove("NoPlaying");
			e.src = 'images/stop.png';
			e.track.start();
		} else {
			e.classList.add("NoPlaying");
			e.src = 'images/play.png';
			e.track.stop();
		}
	}
}

function Pause(e) {
	console.log(e.previousElementSibling.track.state);
	if(!e.previousElementSibling.track){
		console.log("no audio Source");
	} else {
		if(e.previousElementSibling.track.state === 'running') {
			e.previousElementSibling.track.suspend().then(function() {
				console.log('suspend');
			});
		} else if(e.previousElementSibling.track.state === 'suspended') {
			e.previousElementSibling.track.resume().then(function() {
				console.log('resume');
			});  
		}
	}
}
