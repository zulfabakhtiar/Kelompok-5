// Inisialisasi IndexedDB
var db;
var request = indexedDB.open('komentarDB', 1);

request.onerror = function(event) {
    console.log("Error saat membuka database: " + event.target.errorCode);
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("komentar", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("nama", "nama", { unique: false });
    objectStore.createIndex("email", "email", {unique: false});
    objectStore.createIndex("komentar", "komentar", { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    // showComments();
};

// Menambahkan komentar ke dalam IndexedDB
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var nama = document.getElementById('nama').value;
    var email = document.getElementById('email').value;
    var komentar = document.getElementById('komentar').value;

    var transaction = db.transaction(['komentar'], 'readwrite');
    var objectStore = transaction.objectStore('komentar');
    var comment = { nama: nama, email : email, komentar: komentar };
    objectStore.add(comment);

    document.getElementById('nama').value = '';
    document.getElementById('email').value = '';
    document.getElementById('komentar').value = '';
    
    transaction.oncomplete = function() {
        alert("Komentar telah disimpan.");
        document.getElementById("commentForm").reset();
        tampilkanKomentar();
    };

    transaction.onerror = function(event) {
        console.error("Kesalahan saat menyimpan komentar: " + event.target.error);
     };

});

function tampilkanKomentar() {
    var komentarKolom = document.getElementById("komentarKolom");
    komentarKolom.innerHTML = ""; // Hapus konten sebelumnya

    var objectStore = db.transaction("komentar").objectStore("komentar");

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            var komentarDiv = document.createElement("div");
            komentarDiv.innerHTML = "<strong>" + cursor.value.nama + " (" + cursor.value.email + ")<strong><br>" + cursor.value.komentar + "<br>";
            komentarKolom.appendChild(komentarDiv);
            cursor.continue();
        }
    };
}
tampilkanKomentar();
