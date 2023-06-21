// Function to create and show the fake ad
function showFakeAd() {
    // Create the ad
    var ad = document.createElement('div');

    // Style the ad
    ad.style.position = 'fixed';
    ad.style.top = '50%';
    ad.style.left = '50%';
    ad.style.transform = 'translate(-50%, -50%)';
    ad.style.width = '300px';
    ad.style.height = '550px';
    ad.style.backgroundColor = 'white';
    ad.style.color = 'black';
    ad.style.padding = '20px';
    ad.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    ad.style.borderRadius = '10px';

    // Add an image and some text
    ad.innerHTML = '<img src="/static/images/pj.jpg" alt="Funny Image" style="width:100%; height:auto;"><h2>HEEFT U OOK LAST VAN ERECTIEPROBLEMEN?</h2><p>KOOP DAN NU NET ZOALS DEZE JONGEMAN ONZE ERECTIEPILLEN EN HOEF NOOIT MEER TE KLAGEN OVER UW ERECTIEPROBLEEM!</p>';

    // When the ad is clicked, hide it
    ad.onclick = function() {
        ad.style.display = 'none';
    };

    // Add the ad to the page
    document.body.appendChild(ad);
}

// Show the ad after 5 seconds
setTimeout(showFakeAd, 5000);
