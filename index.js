// ==UserScript==
// @name         🤖 PARK BOT 🤖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  🤖🤖🤖🤖🤖🤖🤖
// @author       hunter diamond
// @match        https://www.chronogolf.com/club/the-park-west-palm
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  console.log("🤖🤖🤖🤖🤖🤖");

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Function to simulate a click event
  async function simulateClick(element) {
    if (element) {
      console.log("Element found, performing click");
      element.click();
    } else {
      console.error("Element for clicking not found");
    }
  }

  // Function to find the iframe and return its document
  async function findIframeDocument(iframeSelector) {
    console.log(`Attempting to find iframe with selector: ${iframeSelector}`);
    const iframeElement = document.querySelector(iframeSelector);
    if (iframeElement) {
      console.log("Iframe found, accessing content");
      return (
        iframeElement.contentDocument || iframeElement.contentWindow.document
      );
    } else {
      console.error("Iframe not found");
      return null;
    }
  }

  // Function to find and click the month toggle button inside the iframe
  async function clickMonthToggle(iframeDocument, xpath) {
    const monthToggle = iframeDocument.evaluate(
      xpath,
      iframeDocument,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    await simulateClick(monthToggle);
  }

  async function clickDay(iframeDocument, day) {
    console.log(`Attempting to click day ${day} in the calendar`);



    // Find all the buttons within the calendar
    const dayButtons = iframeDocument.querySelectorAll(
      "table.uib-daypicker button.btn.btn-default"
    );

    // Find the button that matches the day number
    let dayButton = null;
    dayButtons.forEach((button) => {
      if (button.textContent.trim() === String(day)) {
        dayButton = button;
      }
    });


    if (dayButton) {
      console.log(`Clicking on day ${day}`);
      dayButton.click();
    } else {
      console.error(`Day ${day} button not found in the calendar`);
    }
  }

  async function clickContinue(iframeDocument) {
    await delay(500);
    const continueButtonClasses =
      "fl-button fl-button-large fl-button-block fl-button-primary ng-binding";


    const continueButton = iframeDocument.querySelector(
      `.${continueButtonClasses.split(" ").join(".")}`
    );


    if (continueButton && !continueButton.disabled) {
      continueButton.click();
      console.log("CONTINUE BUTTON PRESSED");
    } else {
      console.log("CAN'T FIND THE CONTINUE BUTTON OR IT IS DISABLED");
    }
  }

  async function clickGolferAmount(iframeDocument, no_of_golfers) {
    await delay(500);

    const buttonBaseClassName = "toggler-heading fl-button fl-button-neutral";

    const golferButtons = iframeDocument.querySelectorAll(
      `.${buttonBaseClassName.replace(/ /g, ".")}`
    );

    const golferButtonsArray = Array.from(golferButtons);

    const golferButton = golferButtonsArray.find(
      (button) => button.textContent.trim() === String(no_of_golfers)
    );

    if (golferButton) {
      console.log(`Clicking on golfer amount: ${no_of_golfers}`);
      golferButton.click();
    } else {
      console.error(`Golfer amount button for ${no_of_golfers} not found`);
    }
  }

  async function clickTime(iframeDocument, time) {
    console.log(`Attempting to click time ${time} in the schedule`);

    await delay(2500);

    const timeElements = iframeDocument.querySelectorAll(
      "booking-widget-teetime"
    );

    for (const element of timeElements) {
      const timeTag = element.querySelector(".widget-teetime-tag");
      if (timeTag && timeTag.textContent.trim() === time) {
        console.log(`Time ${time} found, attempting to click.`);
        const wrapper = element.querySelector(
          ".widget-teetime-wrapper a.widget-teetime-rate"
        );
        if (wrapper) {
          wrapper.click();
          console.log(`Clicked on time ${time}`);
          await delay(500);
          const continue_button_class =
            "body > div.widget.ng-isolate-scope > div > div > div.panel.widget-step-confirmation.ng-isolate-scope > div > div > button";

          const checkoutButton = iframeDocument.querySelector(
            continue_button_class
          );
          checkoutButton.click();

          return;
        } else {
          console.error("Time wrapper not found for clicking.");
          return;
        }
      }
    }

    console.error(`Time ${time} not found in the schedule`);
  }
  async function main(day, time) {
    console.log("Starting the process...");

    const iframeSelector = "#teetimes > div > iframe";
    const iframeDocument = await findIframeDocument(iframeSelector);

    if (iframeDocument) {
      console.log("Iframe document accessed.");
      const monthToggleXpath =
        "/html/body/div[2]/div/div/div[2]/div[2]/div/div/div/div/table/thead/tr[1]/th[3]/button";
      await clickMonthToggle(iframeDocument, monthToggleXpath);
      await clickDay(iframeDocument, day);
      await clickContinue(iframeDocument);
      await clickGolferAmount(iframeDocument, 1);
      await clickContinue(iframeDocument);
      await clickTime(iframeDocument, time);
      await clickContinue(iframeDocument);
    } else {
      console.log("Unable to access the iframe document.");
    }
  }

  function addButtonToPage() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.left = "20px";
    container.style.zIndex = "1000";
    container.style.backgroundColor = "#0D1117";
    container.style.padding = "10px";
    container.style.borderRadius = "8px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";

    const dayInput = document.createElement("input");
    dayInput.type = "text";
    dayInput.placeholder = "Enter Day";
    dayInput.style.marginBottom = "10px";

    const timeInput = document.createElement("input");
    timeInput.type = "text";
    timeInput.placeholder = "Enter Time";
    timeInput.style.marginBottom = "10px";

    const button = document.createElement("button");
    button.textContent = "🤖 Start Booking 🤖";
    button.style.padding = "12px";
    button.style.borderRadius = "12px";
    button.style.backgroundColor = "#fff";

    button.addEventListener("click", function () {
      const day = dayInput.value;
      const time = timeInput.value;
      if (day && time) {
        main(day, time);
      } else {
        console.error("Please enter both day and time");
      }
    });

    container.appendChild(dayInput);
    container.appendChild(timeInput);
    container.appendChild(button);

    document.body.appendChild(container);
  }
  addButtonToPage();
})();
