const { remote } = require('webdriverio');
const assert = require('assert');
const yaml = require('js-yaml');
const fs = require('fs');
const { until, By } = require('selenium-webdriver');

describe('Booking.com Reservation Test', function() {
    let driver;
    let config;

    before(async function() {
        try {
            config = yaml.load(fs.readFileSync('browserstack.yml', 'utf8'));
        } catch (e) {
            console.log('Error reading browserstack.yml:', e);
            throw e;
        }

        driver = await remote({
            user: config.userName,
            key: config.accessKey,
            hostname: 'hub-cloud.browserstack.com',
            port: 443,
            path: '/wd/hub',
            capabilities: {
                'app': config.app,
                'device': config.platforms[0].deviceName,
                'os_version': config.platforms[0].osVersion,
                'project': config.projectName,
                'build': config.buildName,
                'name': 'Booking Reservation Test'
            }
        });
    });

    it('should complete a booking reservation flow', async function() {
        try {
            await driver.setImplicitTimeout(30000);
            await handleCookiesScreen();
            await closeSignInScreen();
            await searchDestination('Cusco');
            await selectDates('14 October 2024', '28 October 2024');
            await adjustGuests();
            await searchAccommodations();
            await selectAccommodation();
            await fillGuestInfo('Emmanuel', 'Salazar', 'Emmanuel@mail.com', 'Colombia', '930527611');
        } catch (error) {
            console.error('Error in test execution:', error);
            await takeScreenshot('error_screenshot');
            throw error;
        }
    });

    after(async function() {
        if (driver) {
            await driver.deleteSession();
        }
    }); 

    async function handleCookiesScreen() {
        console.log('Handling cookies screen...');
        try {
            const acceptButton = await driver.$('android=new UiSelector().resourceId("com.booking:id/bt_accept")');
            if (await acceptButton.isDisplayed()) {
                await acceptButton.click();
                await driver.pause(5000);
            }
        } catch (e) {
            console.log('Error or no cookies screen:', e.message);
        }
    }

    async function closeSignInScreen() {
        console.log('Closing sign in screen...');
        try {
            const closeButton = await driver.$('//android.widget.ImageButton[@content-desc="Navigate up"]');
            if (await closeButton.isDisplayed()) {
                await closeButton.click();
                await driver.pause(2000);
            }
        } catch (e) {
            console.log('Error closing sign in screen:', e.message);
            await takeScreenshot('sign_in_screen_error');
        }
    }

    async function searchDestination(destination) {
        console.log(`Searching for destination: ${destination}`);
        try {
            const searchBox = await driver.$('android=new UiSelector().resourceId("com.booking:id/facet_search_box_basic_field_label")');
            await searchBox.click();
            const destinationInput = await driver.$('android=new UiSelector().resourceId("com.booking:id/facet_with_bui_free_search_booking_header_toolbar_content")');
            await destinationInput.setValue(destination);
            const firstResult = await driver.$('android=new UiSelector().resourceId("com.booking:id/facet_disambiguation_content").childSelector(new UiSelector().index(0))');
            await firstResult.click();
        } catch (e) {
            console.log('Error in searchDestination:', e.message);
            await takeScreenshot('search_destination_error');
            throw e;
        }
    }

    async function selectDates(checkIn, checkOut) {
      console.log(`Selecting dates: ${checkIn} to ${checkOut}`);
      try {
          // Esperar a que el calendario esté visible
          await driver.waitUntil(async () => {
              const calendar = await driver.$('android=new UiSelector().resourceId("com.booking:id/calendar_month_list")');
              return calendar.isDisplayed();
          }, { timeout: 10000, timeoutMsg: 'Calendar did not appear' });
  
          // Seleccionar la fecha de check-in
          await selectDate(checkIn);
  
          // Seleccionar la fecha de check-out
          await selectDate(checkOut);
  
          // Confirmar la selección de fechas
          const selectDatesButton = await driver.$('android=new UiSelector().resourceId("com.booking:id/facet_date_picker_confirm")');
          await selectDatesButton.click();
          console.log('Clicked on Select dates button');
  
      } catch (e) {
          console.log('Error in selectDates:', e.message);
          await takeScreenshot('select_dates_error');
          throw e;
      }
  }
  
  async function selectDate(date) {
      console.log(`Selecting date: ${date}`);
      try {
          const dateElement = await driver.$(`android=new UiSelector().description("${date}")`);
          await dateElement.waitForDisplayed({ timeout: 10000 });
          await dateElement.click();
          console.log(`Clicked on date ${date}`);
      } catch (e) {
          console.log(`Error selecting date ${date}:`, e.message);
          // Intenta hacer scroll si la fecha no es visible
          await scrollToDate(date);
      }
  }
  
  async function scrollToDate(date) {
      console.log(`Attempting to scroll to ${date}`);
      let attempts = 0;
      const maxAttempts = 6;
  
      while (attempts < maxAttempts) {
          try {
              const dateElement = await driver.$(`android=new UiSelector().description("${date}")`);
              if (await dateElement.isDisplayed()) {
                  await dateElement.click();
                  console.log(`Successfully scrolled to and clicked ${date}`);
                  return;
              }
          } catch (e) {
              console.log(`Date ${date} not visible, scrolling...`);
          }
  
          // Scroll hacia abajo
          await driver.touchAction([
              { action: 'press', x: 300, y: 1000 },
              { action: 'moveTo', x: 300, y: 200 },
              'release'
          ]);
          
          attempts++;
          await driver.pause(1000);
      }
      
      throw new Error(`Could not find date ${date} after ${maxAttempts} scroll attempts`);
  }
  
  async function takeScreenshot(name) {
    try {
        await driver.saveScreenshot(`./${name}.png`);
        console.log(`Screenshot saved as ${name}.png`);
    } catch (e) {
        console.log('Error taking screenshot:', e.message);
    }
  }
  async function adjustGuests() {
    console.log('Adjusting guests...');
    try {
        const guestsSelector = await driver.$('android=new UiSelector().text("1 room · 2 adults · 0 children")');
        await guestsSelector.click();
        console.log('Clicked on guest selector');

        const addChildButton = await driver.$('android=new UiSelector().resourceId("com.booking:id/bui_input_stepper_add_button").instance(2)');
        await addChildButton.click();
        console.log('Clicked to add a child');

        // Esperar a que aparezca el diálogo de selección de edad
        await driver.waitUntil(async () => {
            const ageSelector = await driver.$('android=new UiSelector().text("< 1 year old")');
            return ageSelector.isDisplayed();
        }, { timeout: 10000, timeoutMsg: '< 1 year old button did not become visible' });

        const ageSelector = await driver.$('android=new UiSelector().text("< 1 year old")');
        await ageSelector.click();
        console.log('Selected < 1 year old');

        const okButton = await driver.$('android=new UiSelector().resourceId("android:id/button1")');
        await okButton.click();
        console.log('Clicked OK button');

    } catch (e) {
        console.log('Error adjusting guests:', e.message);
        await takeScreenshot('adjust_guests_error');
        throw e;
    }
}

async function searchAccommodations() {
    console.log('Searching for accommodations...');
    try {
        const searchButton = await driver.$('android=new UiSelector().resourceId("com.booking:id/facet_search_box_cta")');
        await searchButton.click();
        console.log('Clicked search button');
    } catch (e) {
        console.log('Error in searchAccommodations:', e.message);
        await takeScreenshot('search_accommodations_error');
        throw e;
    }
}

async function selectAccommodation() {
    console.log('Selecting an accommodation...');
    try {
        const accommodation = await driver.$('android=new UiSelector().className("android.widget.ImageView").instance(7)');
        await accommodation.click();
        console.log('Selected accommodation');

        const seeOptionsButton = await driver.$('android=new UiSelector().className("android.view.ViewGroup").instance(8)');
        await seeOptionsButton.click();
        console.log('Clicked See your options');

        const selectButton = await driver.$('android=new UiSelector().resourceId("com.booking:id/rooms_item_select_layout")');
        await selectButton.click();
        console.log('Selected room');

        const reserveButton = await driver.$('android=new UiSelector().resourceId("com.booking:id/main_action")');
        await reserveButton.click();
        console.log('Clicked Reserve button');

    } catch (e) {
        console.log('Error in selectAccommodation:', e.message);
        await takeScreenshot('select_accommodation_error');
        throw e;
    }
}
});