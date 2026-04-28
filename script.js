const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbwEsvzi5thlcpmqWQhwa2SHLY3pFbr9brjjN9u9t1oya-4B-wKF4agg7vzPksw17PrT5A/exec";

let songs = [];
let currentSongIndex = 0;

// 1. スプレッドシートからデータを読み込む
async function loadSongs() {
    try {
        const response = await fetch(SPREADSHEET_URL);
        if (!response.ok) throw new Error('ネットワークエラーっす');
        const data = await response.json();

        songs = data;
        renderSongs();
    } catch (error) {
        console.error("データの読み込みに失敗したっす...:", error);
        document.getElementById('song-list').innerHTML = '<p style="color:white;">スプレッドシートが読み込めへんわ。GASのURLか公開設定を確認してな！</p>';
    }
}

// 2. 曲一覧を画面に描画する
function renderSongs() {
    const songListContainer = document.getElementById('song-list');
    if (!songListContainer) return;
    songListContainer.innerHTML = '';

    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'song-item';
        // サムネイルを自動表示
        item.innerHTML = `
            <img src="https://img.youtube.com/vi/${song.id}/hqdefault.jpg" alt="${song.title}">
            <p>${song.title}</p>
        `;
        item.onclick = () => openModal(index);
        songListContainer.appendChild(item);
    });
}

// 3. モーダルを開く（HTMLのID名に完璧に合わせました！）
function openModal(index) {
    currentSongIndex = index;
    const song = songs[index];

    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-video');
    const titleElement = document.getElementById('modal-title');
    const lyricsElement = document.getElementById('modal-lyrics');

    if (iframe) iframe.src = `https://www.youtube.com/embed/${song.id}?autoplay=1`;
    if (titleElement) titleElement.textContent = song.title;
    if (lyricsElement) lyricsElement.textContent = song.lyrics;

    if (modal) modal.style.display = 'block';
}

// 4. モーダルを閉じる
document.querySelector('.close-btn').onclick = () => {
    closeModal();
};

function closeModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-video');
    if (modal) modal.style.display = 'none';
    if (iframe) iframe.src = '';
}

// 5. 前後の曲への切り替え（左右ボタン）
document.getElementById('prev-btn').onclick = (e) => {
    e.stopPropagation(); // 勝手に閉じないようにガード
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    openModal(currentSongIndex);
};

document.getElementById('next-btn').onclick = (e) => {
    e.stopPropagation();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    openModal(currentSongIndex);
};

// 窓の外をクリックしたら閉じる
window.onclick = (event) => {
    const modal = document.getElementById('video-modal');
    if (event.target == modal) {
        closeModal();
    }
};

// ページ読み込み時に実行！
loadSongs();