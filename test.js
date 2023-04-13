const {_electron: electron} = require('playwright');
const { test, expect } = require('@playwright/test');

test('Prikaz gumba', async()=> {
    const electronApp = await electron.launch({ args: ['.']});

    const window = await electronApp.firstWindow();
    const button = await window.waitForSelector('#new_users');
    const text = await button.textContent();
    expect(text).toContain('Posodobi');
    await window.screenshot({ path: `screenshots/${Date.now()}.png`})
    await window.close();
    await electronApp.close();
})