// Menampilkan pesan saat tombol "Daftar Sekarang" diklik
function showMessage() {
    alert("Terima kasih atas minat Anda! Silakan hubungi kami untuk informasi pendaftaran.");
}

// Menampilkan detail program (di program.html)
function showProgramDetails(program) {
    let message;
    switch (program) {
        case 'IPA':
            message = "Program IPA menawarkan pembelajaran intensif di bidang biologi, fisika, dan kimia dengan fasilitas laboratorium modern.";
            break;
        case 'IPS':
            message = "Program IPS mengajarkan dinamika sosial, ekonomi, dan budaya melalui studi kasus dan proyek interdisipliner.";
            break;
        case 'Ekstrakurikuler':
            message = "Ekstrakurikuler di MTS Darul Falah mencakup berbagai klub seperti robotika, paduan suara, dan tim basket.";
            break;
        default:
            message = "Program tidak dikenali.";
    }
    alert(message);
}

// Smooth scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});