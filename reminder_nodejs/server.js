const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'reminders.json');

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reminder.html'));
});

app.get('/reminders', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        res.json(JSON.parse(data || '[]'));
    });
});

app.post('/reminders', (req, res) => {
    const newReminder = req.body;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        const reminders = JSON.parse(data || '[]');
        reminders.push(newReminder);
        
        fs.writeFile(DATA_FILE, JSON.stringify(reminders, null, 2), err => {
            if (err) {
                return res.status(500).send('Error writing data file');
            }
            res.status(200).send('Reminder saved');
        });
    });
});

app.delete('/reminders/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        const reminders = JSON.parse(data || '[]');
        const updatedReminders = reminders.filter(r => r.id !== id);
        
        fs.writeFile(DATA_FILE, JSON.stringify(updatedReminders, null, 2), err => {
            if (err) {
                return res.status(500).send('Error writing data file');
            }
            res.status(200).send('Reminder deleted');
        });
    });
});

app.patch('/reminders/:id', (req, res) => {
    const { id } = req.params;
    const { title, text, datetime, type, destination, is_active } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        const reminders = JSON.parse(data || '[]');
        const reminderIndex = reminders.findIndex(r => r.id === id);
        
        if (reminderIndex !== -1) {
            if (title !== undefined) reminders[reminderIndex].title = title;
            if (text !== undefined) reminders[reminderIndex].text = text;
            if (datetime !== undefined) reminders[reminderIndex].datetime = datetime;
            if (type !== undefined) reminders[reminderIndex].type = type;
            if (destination !== undefined) reminders[reminderIndex].destination = destination;
            if (is_active !== undefined) reminders[reminderIndex].is_active = is_active;

            fs.writeFile(DATA_FILE, JSON.stringify(reminders, null, 2), err => {
                if (err) {
                    return res.status(500).send('Error writing data file');
                }
                res.status(200).send('Reminder updated');
            });
        } else {
            res.status(404).send('Reminder not found');
        }
    });
});


app.delete('/reminders', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), err => {
        if (err) {
            return res.status(500).send('Error writing data file');
        }
        res.status(200).send('All reminders deleted');
    });
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/reminder.html/register', (req, res) => {
    const { email, password, login } = req.body;
    
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');
        
        const users = JSON.parse(data || '[]');
        const existingUser  = users.find(user => user.email === email);
        const existingLogin = users.find(user => user.login === login);
        
        if (existingUser ) {
            return res.status(400).send('User already exists');
        }
        
        if (existingLogin) {
            return res.status(400).send('Login exists');
        }

        const newUser  = {
            user_id: Date.now().toString(),
            login,
            email,
            password,
            telegram_id: null,
            is_banned: false,
            is_admin: false,
            reminders: []
        };

        users.push(newUser );
        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), err => {
            if (err) return res.status(500).send('Error writing data file');
            res.status(201).send('User registered successfully');
        });
    });
});

app.post('/reminder.html/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        const users = JSON.parse(data || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.password !== password) {
            return res.status(401).send('Invalid password');
        }

        if (user.is_banned) {
            return res.status(403).send('User is banned');
        }

        if (user.is_admin) {
            return res.status(200).send('Admin login successful');
        }
        res.status(200).send('Login successful');
    });
});

app.post('/logout', (req, res) => {
    // Очищаем сессию или токен аутентификации
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Ошибка выхода');
        }
        res.json({ message: 'Вы успешно вышли' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
