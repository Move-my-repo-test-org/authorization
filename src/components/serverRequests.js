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
    if (rawResponse.status === 200) {
        const content = await rawResponse.json();
        return content;
    }
}

const signInRequest = async (email, pass) => {
    const rawResponse = await fetch(`${baseUrl}/login?email=${email}&password=${pass}`, {
        method: 'POST'
    });
    if (rawResponse.status === 200) {
        const content = await rawResponse.json();
        localStorage.setItem('token', content.body.access_token);
        localStorage.setItem('refreshToken', content.body.refresh_token);
    }
}

const getRefreshedToken = async () => {
    const rawResponse = await fetch(`${baseUrl}/refresh`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
        }
    });
    if (rawResponse.status === 200) {
        const content = await rawResponse.json();
        localStorage.setItem('token', content.body.access_token);
        localStorage.setItem('refreshToken', content.body.refresh_token);
        return getMe();
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
    } else if (content.body.code === 1006) {
        return 'expiredToken';
    } else if (content.body.code === 1004) {
        return 'emptyToken';
    } else {
        return 'authorized';
    }

}

export { signUpRequest, signInRequest, getRefreshedToken, getMe };