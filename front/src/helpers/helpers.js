export const errorHttpFactory = ({body}, setMessage) =>{
    body = body && body.error && typeof body.error == 'object' ? body.error : body;

    const messages = body && body.message ? body.message : [];

    if(!messages && (messages && !Array.isArray(messages))){
        return;
    }
    for (let i = 0, length = messages.length; i < length; i++){
        const local_messages = messages[i];
        if(local_messages) {
            const constraints = local_messages.constraints ? Object.keys(local_messages.constraints) : [];
            const oneError = constraints[0];
            oneError && setMessage( 'error', local_messages.constraints[oneError], true);
        }
    }
};

export const reformatLetterFactory = (nameArr) =>{
    if (nameArr.length === 1) {
        const letters = nameArr[0];
        return letters ? `${letters[0]}${letters[1]}` : ''
    } else if (nameArr.length > 1) {
        const letters1 = nameArr[0];
        const letters2 = nameArr[1];
        return letters1 && letters2 ? `${letters1[0]}${letters2[0]}` : ''
    } else {
        return ''
    }
};
