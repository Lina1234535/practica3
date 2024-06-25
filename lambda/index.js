const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {  
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome Lina, you can say Hello or Help. Which would you like to try?',
            HELLO_MESSAGE: 'Hello World Lina!',
            HELP_MESSAGE: 'You can say hello to me! How can I help Lina?',
            GOODBYE_MESSAGE: 'Goodbye!, Lina',
            REFLECTOR_MESSAGE: 'Lina, You just triggered %s',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again Lina.',
            ERROR_MESSAGE: 'Sorry, there was an error. Please try again Lina.',
            CONVERT_MESSAGE: '{degrees} degrees Fahrenheit is {result} degrees Celsius.'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenida Lina, puedes decir Hola o Ayuda. ¿Cuál te gustaría probar?',
            HELLO_MESSAGE: 'Hola Mundo!, Lina',
            HELP_MESSAGE: '¡Puedes saludarme! ¿Cómo puedo ayudar Lina?',
            GOODBYE_MESSAGE: 'Adiós Lina!',
            REFLECTOR_MESSAGE: 'Lina acabas de desencadenar %s',
            FALLBACK_MESSAGE: 'Lo siento, no sé nada de eso. Inténtalo de nuevo Lina.',
            ERROR_MESSAGE: 'Lo sentimos, ha habido un error. Inténtalo de nuevo Lina.',
            CONVERT_MESSAGE: '{grados} grados Celsius son {result} grados Fahrenheit.'
        }
    }
};

const ConvertIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'IntentConvert';
    },
    handle(handlerInput) {
        console.log('ConvertIntentHandler: handle called');
        const locale = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const unit = locale.startsWith('es') ? 'grados' : 'degrees';
        const input = handlerInput.requestEnvelope.request.intent.slots[unit].value;

        console.log(`Locale: ${locale}`);
        console.log(`Unit: ${unit}`);
        console.log(`Input: ${input}`);

        let result;
        if (locale.startsWith('es')) {
            result = (input * 9/5) + 32; // Convert Celsius to Fahrenheit
        } else {
            result = (input - 32) * 5/9; // Convert Fahrenheit to Celsius
        }

        console.log(`Result: ${result}`);

        const speechText = requestAttributes.t('CONVERT_MESSAGE', { degrees: input, result: result.toFixed(2) });
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        console.log('LaunchRequestHandler: handle called');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        console.log('HelloWorldIntentHandler: handle called');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELLO_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        console.log('HelpIntentHandler: handle called');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        console.log('CancelAndStopIntentHandler: handle called');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        console.log('FallbackIntentHandler: handle called');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = requestAttributes.t('REFLECTOR_MESSAGE', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
        ConvertIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor, LoggingRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
