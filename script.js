const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbwEsvzi5thlcpmqWQhwa2SHLY3pFbr9brjjN9u9t1oya-4B-wKF4agg7vzPksw17PrT5A/exec";

async function loadSongs() {
    try {
        const response = await fetch(SPREADSHEET_URL);
        const data = await response.json();
        const listElement = document.getElementById('song-list');
        if (!listElement) return;
        listElement.innerHTML = '';

        data.forEach((song) => {
            const li = document.createElement('li');
            li.className = 'song-item';
            li.innerHTML = `<strong>${song.title}</strong>`;
            // クリックされたらその曲のデータを渡す
            li.onclick = () => openModal(song);
            listElement.appendChild(li);
        });
    } catch (error) {
        console.error("読み込みエラーっす:", error);
    }
}

function openModal(song) {
    const modal = document.getElementById('modal');
    // 【重要】クリックされた瞬間に、改めてHTMLの箱（ID）を探す！
    const iframe = document.getElementById('modal-video');
    const lyricsElement = document.getElementById('modal-lyrics');
    const titleElement = document.getElementById('modal-title');

    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${song.id}`;
    } else {
        console.error("modal-video というIDのタグが見つからへんで！");
    }

    if (lyricsElement) lyricsElement.textContent = song.lyrics;
    if (titleElement) titleElement.textContent = song.title;

    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    const iframe = document.getElementById('modal-video');
    if (modal) modal.style.display = 'none';
    if (iframe) iframe.src = '';
}

window.onload = loadSongs;