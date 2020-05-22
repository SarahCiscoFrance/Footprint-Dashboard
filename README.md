# Footprint-Dashboard

![Image description](https://i.ibb.co/JHyBH2n/Capture-d-e-cran-2020-05-22-a-22-47-43.png)
![Image description](https://i.ibb.co/yFBMmb7/Capture-d-e-cran-2020-05-22-a-23-27-25.png)

### What is it ?

A dashboard that estimates the carbon footprint saved for a month thanks the use of a
webex device.
it also estimates the time and number of trips saved.
This page can be displayed directly on endpoint by the use of Digital Signage
and the data are refreshed after every call.

### Why ?

**To answer these questions:**

- How many metric tonnes of greenhouse gas emissions did Cisco avoid ?
- How much time do you save by using Cisco terminal?

### How it works?

At the end of each call the server collects the history of call, then the service process all the
data and call an external API in order to generate a specific footprint page to display in digital
signage
![Image description](https://i.ibb.co/5TR31xk/Capture-d-e-cran-2020-05-22-a-23-04-03.png)

The data displayed depends on the url:
`http://websrv2.ciscofrance.com:15124/MAC_ADDRESS` where the MAC_ADDRESS is the variable part

### The footprint Algorithm:

I created an algorithm which is based on location of the endpoint. the algorithm choose the
most suitable mode of transport to link 2 cities and thus determine the carbon footprint
saved thanks to cisco.

So the mode of transport chosen depends on the distance between the two callers:  
For example, if you have a call between Cannes and Nice the algorithm will choose the car and if you have a call between Paris and New York the algorithm will choose the case of a business flight.

### Questions ?

if you have questions contact:

- **Email**: rudferna@cisco.ocm
- **Github**: [rocket-star](https://github.com/rocket-star/)

#

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
