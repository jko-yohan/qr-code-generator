(() => {
    const input = document.getElementById('qr-input');
    const output = document.getElementById('qr-output');
    const sizeSelect = document.getElementById('qr-size');
    const fgColor = document.getElementById('qr-fg');
    const bgColor = document.getElementById('qr-bg');
    const btnDownload = document.getElementById('btn-download');

    let currentDataURL = null;

    document.getElementById('btn-generate').addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;

        const size = parseInt(sizeSelect.value);
        const qr = qrcode(0, 'M');
        qr.addData(text);
        qr.make();

        const moduleCount = qr.getModuleCount();
        const cellSize = Math.floor(size / moduleCount);
        const totalSize = cellSize * moduleCount;

        const canvas = document.createElement('canvas');
        canvas.width = totalSize;
        canvas.height = totalSize;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, totalSize, totalSize);

        ctx.fillStyle = fgColor.value;
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (qr.isDark(row, col)) {
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }

        output.innerHTML = '';
        output.appendChild(canvas);

        currentDataURL = canvas.toDataURL('image/png');
        btnDownload.disabled = false;
    });

    btnDownload.addEventListener('click', () => {
        if (!currentDataURL) return;
        const a = document.createElement('a');
        a.href = currentDataURL;
        a.download = 'qrcode.png';
        a.click();
    });
})();
