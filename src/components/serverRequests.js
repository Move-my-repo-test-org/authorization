const baseUrl = 'http://142.93.134.108:1111';

const signUpRequest = async (userData) => {
    const rawResponse = await fetch(`${baseUrl}/sign_up`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    const content = await rawResponse.json();
    if (content.status === "Ok") {
        return 'ok';
    } else {
        return 'error';
    }
}

const signInRequest = async (email, pass) => {
    const rawResponse = await fetch(`${baseUrl}/login?email=${email}&password=${pass}`, {
        method: 'POST'
    });
    const content = await rawResponse.json();
    if (content.statusCode === 200) {
        localStorage.setItem('token', content.body.access_token);
        localStorage.setItem('refreshToken', content.body.refresh_token);
        return 'ok';
    } else {
        return 'error';
    }
}

const getRefreshedToken = async () => {
    const rawResponse = await fetch(`${baseUrl}/refresh`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
        }
    });
    const content = await rawResponse.json();
    if (content.statusCode === 200) {
        localStorage.setItem('token', content.body.access_token);
        localStorage.setItem('refreshToken', content.body.refresh_token);
        return getMe();
    } else {
        return 'error';
    }
}

const getMe = async () => {
    const rawResponse = await fetch(`${baseUrl}/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    });
    const content = await rawResponse.json();
    if (content.code === 1002) {
        return 'notAuthorized';
    }
    switch (content.body.code) {
        case 1006:
            return 'expiredToken';
        case 1004:
            return 'emptyToken';
        default:
            return 'authorized';
    }


}

export { signUpRequest, signInRequest, getRefreshedToken, getMe };