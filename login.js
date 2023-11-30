document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');

    fetch('https://jkt48.jnckmedia.com/wrap/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    })
    .then(response => response.json())
    .then(data => {
        loading.classList.add('hidden');
        if(data.success) {
            alert('Login successful!');
    
            // Sembunyikan form login
            const loginForm = document.getElementById('loginForm');
            loginForm.remove(); // Menghapus form login

            // Ambil container untuk tombol
            const buttonContainer = document.getElementById('buttonContainer');
            buttonContainer.innerHTML = ''; // Bersihkan isi sebelumnya jika ada
    
            // Tambahkan header untuk tombol tahun
            const header = document.createElement('h2');
            header.classList.add('vanta-font');
            header.textContent = 'JKT48 Wrapped';
            buttonContainer.appendChild(header);

            const subHeader = document.createElement('p');
            subHeader.classList.add('vanta-font');
            subHeader.textContent = 'Pilih tahun';
            buttonContainer.appendChild(subHeader);

            // Append buttons for each year
            data.data.forEach(item => {
                const btn = document.createElement('button');
                btn.innerText = item.year;
                btn.classList.add('btn', 'btn-primary', 'mr-2', 'vanta-font'); // Bootstrap classes
                btn.onclick = () => fetchData(item.cookie, item.year);
                buttonContainer.appendChild(btn);
            });
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function toggleTopUpVisibility() {
    const topUpElement = document.getElementById('top-up-value');
    const toggleButton = document.getElementById('toggle-top-up');
    
    topUpElement.classList.toggle('hidden');
    if (topUpElement.classList.contains('hidden')) {
        toggleButton.textContent = 'Show';
    } else {
        toggleButton.textContent = 'Hide';
    }
}

function ensureThreeEntries(array) {
    while (array.length < 3) {
        array.push("-");
    }
    return array;
}

function createCard(data, year) {
    const cardBody = document.querySelector('.card-body');
    cardBody.classList.add('poppins-font');
    let topSetlists = Array.isArray(data.theater.topSetlists) ? ensureThreeEntries([...data.theater.topSetlists]) : [data.theater.topSetlists];
    let topVCMembers = Array.isArray(data.videoCall.topMembers) ? ensureThreeEntries([...data.videoCall.topMembers]) : [data.videoCall.topMembers];
    let imgProxy = "https://api.codetabs.com/v1/proxy/?quest=";
    cardBody.innerHTML = `
        <h5 class="card-title text-center">JKT48 Wrapped ${year} (${data.name})</h5><br>
        <center><img src="${imgProxy}${encodeURIComponent(data.oshiPic)}" width="50%" height="50%" class="img-fluid"><br><b>Oshi:</b> ${data.oshi}</center><br>
        <div class="row">
            <div class="col-md-6">
                <b>• Theater</b><br>
                ${(data.theater.topSetlists.length != 0) ? `
                <b>Top Setlists:</b><br>${Array.isArray(topSetlists) ? topSetlists.join('<br>') : topSetlists}<br><br>
                <div class="mobile-spacing">
                    <b>🏆 Winrate:</b> ${data.theater.winrate.rate}<br>(<b>Menang:</b> ${data.theater.winrate.detail.menang}x, <b>Kalah:</b> ${data.theater.winrate.detail.kalah}x)
                </div>
                ` : data.theater}
            </div>
            <div class="col-md-6">
                <b>• Video Call</b><br>
                ${(data.videoCall.totalTickets) ? `
                <b>Top Video Call Members:</b><br>${Array.isArray(topVCMembers) ? topVCMembers.join('<br>') : topVCMembers}<br><br>
                <b>Total Video Call:</b><br>${(data.videoCall.totalTickets) ? `${data.videoCall.totalTickets} tiket` : data.videoCall} 
                ` : data.videoCall}
            </div>
        </div><br>
        <b>• Events</b><br>
        <b>Last Events:</b><br>${Array.isArray(data.events.lastEvents) ? data.events.lastEvents.map(event => `- ${event}`).join('<br>') : data.events}<br><br>
        <b>Total Top-Up:</b><br>${data.topUp}<br><br>
        <center><small><b>#JKT48Wrapped made with ❤️ by JKT48 Live</b></small></center>
    `;
}

function fetchData(cookie, year) {
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');

    fetch('https://jkt48.jnckmedia.com/wrap/getData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cookie: cookie,
            year: year
        }),
    })
    .then(response => response.json())
    .then(data => {
        loading.classList.add('hidden');
        if(data.success) {
            createCard(data.data, year); // Kirim year ke createCard
            //setTimeout(() => createCanvasFromCard(), 100);
        } else {
            alert('Gagal mengambil data: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/*function createCanvasFromCard() {
    const cardBody = document.querySelector('.card-body');
    html2canvas(cardBody, { useCORS: true, scale: 1 }).then(canvas => {
        // Buat wrapper untuk tombol agar berada di tengah
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('text-center');

        // Buat tombol untuk download
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download Image';
        downloadBtn.classList.add('btn', 'btn-success', 'mt-3');

        // Tambahkan event listener ke tombol untuk mendownload canvas sebagai gambar
        downloadBtn.addEventListener('click', function() {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'jkt48-wrapped.png';
            link.href = image;
            link.click();
        });

        // Tambahkan tombol ke wrapper
        buttonWrapper.appendChild(downloadBtn);

        // Tambahkan wrapper ke halaman, misalnya di bawah cardBody
        cardBody.appendChild(buttonWrapper);
    });
}*/
