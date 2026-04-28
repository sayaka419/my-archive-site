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
    const iframe = document.getElementById('youtube-video');
    const lyricsElement = document.getElementById('modal-lyrics');

    // YouTubeのURLをセット（IDから埋め込み用URLを作る）
    iframe.src = `https://www.youtube.com/embed/${song.id}`;
    // 歌詞をセット（<pre>タグのおかげで改行がそのまま反映されるっす！）
    lyricsElement.textContent = song.lyrics;

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    const iframe = document.getElementById('youtube-video');
    modal.style.display = 'none';
    iframe.src = ''; // 閉じたら動画を止めるっす
}

// サイトを開いた時に曲を読み込む
window.onload = loadSongs;