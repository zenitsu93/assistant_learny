document.addEventListener('DOMContentLoaded', function() {
    const micButton = document.querySelector('.mic-button');
    const micIcon = micButton.querySelector('.mic-icon');
    const messageTextarea = document.getElementById('message');
    let recognition;
    let isRecording = false;

    // Fonction pour générer un bip sonore
    function beep() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz = La4
        oscillator.type = 'sine';

        oscillator.start();
        setTimeout(() => oscillator.stop(), 200); // Durée du bip : 200ms
    }

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'fr-FR';

        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                let transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            messageTextarea.value = finalTranscript + interimTranscript;
        };

        recognition.onerror = function(event) {
            console.error('Erreur de reconnaissance vocale:', event.error);
            stopRecording();
        };
    } else {
        console.log('La reconnaissance vocale n\'est pas supportée par ce navigateur.');
        micButton.style.display = 'none';
    }

    function startRecording() {
        if (recognition) {
            beep(); // Jouer le bip sonore
            recognition.start();
            isRecording = true;
            micIcon.src = MIC_ACTIVE_ICON;
        }
    }

    function stopRecording() {
        if (recognition) {
            recognition.stop();
            isRecording = false;
            micIcon.src = MIC_ICON;
        }
    }

    micButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });
});