document.addEventListener('DOMContentLoaded', () => {
    const wsEndpoint = 'wss://api.shoonya.com/NorenWSTP/';
    const socket = new WebSocket(wsEndpoint);

    socket.addEventListener('open', () => {
        console.log('WebSocket connection opened');
        
        const credentials = {
            userid: 'FA330127',
            password: 'yash@Shoo73',
            twoFA: 'OTP/TOTP',
            vendor_code: 'FA330127_U',
            api_secret: 'a8f4560605d478c4cdac930c135285da',
            imei: 'abc1234'
        };
        socket.send(JSON.stringify({ action: 'login', credentials }));
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'login_response' && data.success) {
            console.log('Login successful');
            document.getElementById('subscribeBtn').disabled = false;
        } else if (data.type === 'login_response' && !data.success) {
            console.error('Login failed:', data.error);
        } else if (data.type === 'stock_price') {
            const stockSymbol = data.symbol;
            const price = data.price;
            document.getElementById('stockPrice').textContent = `Stock Price (${stockSymbol}): ${price}`;
        }
    });

    socket.addEventListener('close', () => {
        console.log('WebSocket connection closed');
    });

    document.getElementById('subscribeBtn').addEventListener('click', () => {
        const stockSymbol = document.getElementById('stockSymbol').value.trim();
        if (stockSymbol) {
            socket.send(JSON.stringify({ action: 'subscribe', symbol: stockSymbol }));
        }
    });
});
