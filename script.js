let songs = []; // 曲データを格納する空の配列
let currentSongIndex = 0;

// 1. 【心臓部】GitHub上の data.json を読み込む魔法
async function loadSongs() {
    try {
        // 同じフォルダにある data.json を取ってくる
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('data.jsonが見つかりません');

        const songsData = await response.json();

        // 読み込んだデータを配列に入れる
        songs = songsData;

        // 画面に曲一覧を描画
        renderSongs();
    } catch (error) {
        console.error("データの読み込みに失敗したっす...:", error);
        // エラーが出た時用のダミー表示
        document.getElementById('song-list').innerHTML = '<p style="color:white;">曲データが読み込めへんかったわ。data.jsonがあるか確認してな！</p>';
    }
}

// 2. 曲一覧を描画する
function renderSongs() {
    const songListContainer = document.getElementById('song-list');
    songListContainer.innerHTML = ''; // 一旦空にする

    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'song-item';
        item.innerHTML = `
            <img src="https://img.youtube.com/vi/${song.id}/hqdefault.jpg" alt="${song.title}">
            <p>${song.title}</p>
        `;
        item.onclick = () => openModal(index);
        songListContainer.appendChild(item);
    });
}

// 3. モーダルを開く
function openModal(index) {
    currentSongIndex = index;
    const song = songs[index];

    document.getElementById('modal-video').src = `https://www.youtube.com/embed/${song.id}?autoplay=1`;
    document.getElementById('modal-title').textContent = song.title;
    document.getElementById('modal-lyrics').textContent = song.lyrics;
    document.getElementById('video-modal').style.display = 'block';
}

// 4. モーダルを閉じる
document.querySelector('.close-btn').onclick = () => {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('modal-video').src = ''; // 動画を止める
};

// 5. 前後の曲へのナビゲーション
document.getElementById('prev-btn').onclick = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    openModal(currentSongIndex);
};

document.getElementById('next-btn').onclick = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    openModal(currentSongIndex);
};

// 窓の外をクリックしたら閉じる
window.onclick = (event) => {
    const modal = document.getElementById('video-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
        document.getElementById('modal-video').src = '';
    }
};

// ページ読み込み時に実行！
loadSongs();