/**
 * backend/index.js
 * 
 * What it Does:
 *   This file reads through the routes directory and finds every route that needs to be set up on the server.
 *   Routes need to have a koji.json file telling this script where to find the code for the route and what
 *   endpoint to put the route on on the server. In production these routes are setup on AWS lambdas.
 * 
 * Things to Change:
 *   Any specific routes should go in the route directory and not here. If you would like to change anything
 *   about how the routes that you have made should be handled and put on to the server then this is the place
 *   to do it.
 */
