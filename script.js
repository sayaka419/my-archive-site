const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbwEsvzi5thlcpmqWQhwa2SHLY3pFbr9brjjN9u9t1oya-4B-wKF4agg7vzPksw17PrT5A/exec";

async function loadSongs() {
    try {
        const response = await fetch(SPREADSHEET_URL);
        const data = await response.json();
        const listElement = document.getElementById('song-list');
        listElement.innerHTML = ''; // リストを空にする

        data.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'song-item';
            li.innerHTML = `<strong>${song.title}</strong>`;
            li.onclick = () => openModal(song);
            listElement.appendChild(li);
        });
    } catch (error) {
        console.error("データの読み込みに失敗したで:", error);
        document.getElementById('song-list').innerHTML = "<li>データが読み込めないよってでてくる</li>";
    }
}

function openModal(song) {
    const modal = document.getElementById('modal');
    // ↓ ここ！ 'youtube-video' を 'modal-video' に変更っす！
    const iframe = document.getElementById('modal-video');
    const lyricsElement = document.getElementById('modal-lyrics');
    const titleElement = document.getElementById('modal-title'); // タイトルも表示できるで！

    iframe.src = `https://www.youtube.com/embed/${song.id}`;
    lyricsElement.textContent = song.lyrics;
    if (titleElement) titleElement.textContent = song.title; // タイトル表示用の箱があれば入れる

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    // ↓ ここも！ 'youtube-video' を 'modal-video' に変更！
    const iframe = document.getElementById('modal-video');
    modal.style.display = 'none';
    iframe.src = '';
}

// サイトを開いた時に曲を読み込む
window.onload = loadSongs;