// 0. 【ロード】ページを開いた瞬間に、貯金箱からデータを引き出す
const savedSongs = localStorage.getItem('my_song_list');
if (savedSongs) {
    // 貯金箱にデータがあれば、songs.js の中身に合体させる
    const extraSongs = JSON.parse(savedSongs);
    songs.push(...extraSongs); 
}

let currentSongIndex = 0;

// 1. 曲一覧を描画
function renderSongs(){
    const songListContainer = document.getElementById('song-list');

    // 【重要！】これがないと、前の曲たちが残ったまま新しいのが追加されてまう
    songListContainer.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'song-item';
        item.innerHTML = `
            <img src="https://img.youtube.com/vi/${song.id}/hqdefault.jpg" alt="${song.title}">
            <p>${song.title}</p>
        `;
        // 1つずつ消すボタン、上に入れる
        //<button class="delete-btn" onclick="confirmDelete(event, '${song.id}')">×</button>
        item.onclick = () => openModal(index);
        songListContainer.appendChild(item);
    });
}

// 間違えて消さないように確認ダイアログを出す処理
function confirmDelete(event, id) {
    // 親要素の「モーダルを開く」イベントが動かないように止める
    event.stopPropagation(); 
    
    if (confirm("この曲、リストから削除してええの？")) {
        deleteSong(id);
    }
}

renderSongs();

// 2. モーダルを開く
const modal = document.getElementById('video-modal');
const iframe = document.getElementById('modal-video');
const title = document.getElementById('modal-title');
const lyrics = document.getElementById('modal-lyrics');

function openModal(index) {
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    const container = document.querySelector('.lyrics-container');
    
    // YouTube埋め込みURLの生成（autoplay & mute）
    iframe.src = `https://www.youtube.com/embed/${song.id}?autoplay=1&mute=1`;
    title.textContent = song.title;
    lyrics.textContent = song.lyrics;

    // 【重要！】「pre」じゃなくて、スクロールが発生してる「div」の方をリセット！
    if (container) {
        container.scrollTop = 0;
    }
    
    modal.style.display = 'flex';
}

// 3. 閉じる処理
function closeModal() {
    modal.style.display = 'none';
    iframe.src = ''; // 動画を止める
}

document.querySelector('.close-btn').onclick = closeModal;

// 4. 前へ・次へ
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    openModal(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    openModal(currentSongIndex);
}

document.getElementById('next-btn').onclick = nextSong;
document.getElementById('prev-btn').onclick = prevSong;

// モーダル外側クリックで閉じる
window.onclick = (event) => {
    if (event.target == modal) closeModal();
};

function addNewSong() {
    const id = document.getElementById('new-id').value;
    const title = document.getElementById('new-title').value;
    const lyrics = document.getElementById('new-lyrics').value;

    if (!id || !title || !lyrics) {
        alert("全部埋めてください");
        return;
    }
    const newSong = { id, title, lyrics: lyrics };
    // 1. 配列の先頭に追加
    //songs.unshift({ id, title, lyrics });
    // 1. 配列の最後に追加
    songs.push(newSong);

    // 2. 【セーブ】貯金箱（LocalStorage）に保存する
    // 今まで追加した分だけを抽出して保存する
    const currentExtras = JSON.parse(localStorage.getItem('my_song_list') || "[]");
    currentExtras.push(newSong);
    localStorage.setItem('my_song_list', JSON.stringify(currentExtras));
    
    // 既存の描画ロジックを再実行（共通化しとくと楽！）
    renderSongs(); 

    // 3. 入力欄を空にする
    document.getElementById('new-id').value = '';
    document.getElementById('new-title').value = '';
    document.getElementById('new-lyrics').value = '';

    alert("追加しました");
}

// 【管理者用】追加した曲を全部消去する
function clearAllExtraSongs() {
    if (confirm("本当に全部消しますか？")) {
        // 1. 貯金箱を空にする
        localStorage.removeItem('my_song_list');
        
        // 2. ページをリロードして、songs.js の初期状態に戻す
        location.reload();
    }
}

// 【こだわり版】特定の1曲だけ消したい場合はこれ！
function deleteSong(id) {
    // 貯金箱からデータを取ってくる
    let currentExtras = JSON.parse(localStorage.getItem('my_song_list') || "[]");
    
    // 指定したID以外の曲だけを残す（フィルタリング）
    currentExtras = currentExtras.filter(song => song.id !== id);
    
    // 貯金箱を更新
    localStorage.setItem('my_song_list', JSON.stringify(currentExtras));
    
    // 画面を更新
    location.reload();
}