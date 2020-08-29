import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Box, Button, FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import './Authorization.scss';
import { AuthAPI } from '../../api/AuthAPI';
import { PhonePinConfirm } from '../../store/Auth/types';
import Spinner from '../Spinner/Spinner';
import InputPhoneFormated from '../bricks/InputPhoneFormated';
// import MaskedInput from 'react-text-mask';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const Authorization: React.FC<Props> = (props) => {
    const { phone, authByPhoneAction, phonePinConfirmAction, setLoaderAction } = props;
    // const [confirm, setConfirm] = useState(false);
    // const [ pinValue, setPinValue ] = useState('');
    const [ password, setPassword ] = useState('');
    // const [disabled, setDisabled] = useState(true);
    const [message, setMessage] = useState('');
    // const [confirmError, setConfirmError] = useState({
    //     error: false,
    //     message: ''
    // });

    // const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     // if(event.target.value.length > 15) {
    //     //     setDisabled(false)
    //     // } else {
    //     //     setDisabled(true);
    //     // }
    //     // const newPhone = event.target.value.split(" ").join("").split("+").join("");
    //     authByPhoneAction(event.target.value);
    // };

    const onPhoneChanged = (value: string) => {
        authByPhoneAction(value);
    }



    // const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setPinValue(event.target.value);
    // };

    const loginClick = () => {
        if(phone) {
            AuthAPI.authByPassword(phone, password).then(res => {
                phonePinConfirmAction(res.data);
            }).catch(({response}) => setMessage(response.data.message));

            // AuthAPI.authByPhone(phone).then(res => {
            //     const { message, result } = res.data;
            //     if(result === 'userNotFound') {
            //         return setPhoneError({error: true, message});
            //     }
            //     if(result === 'userFound') {
            //         getMessageAction('код отправлен на номер +' + phone, result);
            //         setConfirm(true);
            //     }
            // })
            // .catch(({response}) => setPhoneError({ error: true, message: response.data.message}));
        }
    }

    // const confirmClick = () => {
    //     if(phone) {
    //         AuthAPI.phonePinConfirm(pinValue, phone).then(res => {
    //             phonePinConfirmAction(res.data);
    //         })
    //         .catch(() => setConfirmError({ error: true, message: 'код указан не верно'}));
    //     }
    // }

    const onKeyDownLogin = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            loginClick();
        }
    }

    // const onKeyDownConfirm = (event: React.KeyboardEvent<HTMLDivElement>) => {
    //     if (event.key === 'Enter') {
    //         event.preventDefault();
    //         event.stopPropagation();
    //         confirmClick();
    //     }
    // }

    useEffect(() => {
        setLoaderAction(true);
        const timer = setTimeout(() => {
            setLoaderAction(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, [setLoaderAction]);

    const authorizationBox = () => {
        return (
            <>
                <Spinner fixed="fixed" />
                <div className="phoneContent">
                    {/* <FormControl fullWidth onKeyDown={onKeyDownLogin}>
                        <InputLabel shrink>Введите свой номер телефона</InputLabel>
                        <Input
                            autoFocus
                            value={phone ? phone : ''}
                            onChange={handlePhoneChange}
                            // inputComponent={TextMaskCustom as any} 
                            />
                    </FormControl> */}
                    <InputPhoneFormated 
                        label="Введите свой номер телефона"
                        value={phone ? phone : ''}
                        onPhoneChange={(newState) => onPhoneChanged(newState.value)}
                        fullWidth />
                    <FormControl fullWidth onKeyDown={onKeyDownLogin}>
                        <InputLabel shrink>Введите пароль</InputLabel>
                        <Input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)} />
                            <FormHelperText style={{color: 'red'}}>{message}</FormHelperText>
                    </FormControl>
                    <div className="phoneContent__btn">
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={loginClick}
                            disableElevation
                            // disabled={phone && phone.length > 10 ? false : disabled}
                            >Войти</Button>
                    </div>
                </div>
            </>
        )
    }

    // const confirmBox = () => {
    //     return (
    //         <div className="phoneContent">
    //             <FormControl fullWidth onKeyDown={onKeyDownConfirm} error={confirmError.error}>
    //                 <InputLabel shrink>Введите 4-значный код из СМС</InputLabel>
    //                 <Input
    //                     autoFocus
    //                     value={pinValue}
    //                     onChange={handlePinChange} />
    //                     <FormHelperText>{confirmError.message}</FormHelperText>
    //             </FormControl>
    //             <div className="phoneContent__btn">
    //                 <Button 
    //                     variant="contained" 
    //                     color="primary" 
    //                     disableElevation
    //                     onClick={confirmClick}>Войти</Button>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="authorization">
            <div className="authorization__content">
                <div className="authorization__logo">
                    <svg width="325" height="111" viewBox="0 0 325 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M70.8125 38H26.1875C21.1212 38 17 42.1639 17 47.2825V76.4565C17 81.5751 21.1212 85.7391 26.1875 85.7391H30.125V97.6739C30.125 98.1884 30.419 98.6579 30.881 98.8753C31.0569 98.9602 31.2486 99 31.4376 99C31.7394 99 32.0387 98.894 32.2776 98.6923L47.6628 85.7391H70.8127C75.8788 85.7391 80 81.5751 80 76.4565V47.2825C80 42.1639 75.8788 38 70.8125 38ZM64.25 71.1521C64.25 71.6428 63.9823 72.0909 63.557 72.3217C63.3627 72.4277 63.1501 72.4782 62.9375 72.4782C62.6829 72.4782 62.4282 72.404 62.2104 72.2554L56.375 68.3249V71.1521C56.375 71.8841 55.787 72.4782 55.0625 72.4782H36.6875C32.8602 72.4782 32.75 62.9542 32.75 61.8695C32.75 60.7849 32.8602 51.2609 36.6875 51.2609H55.0625C55.787 51.2609 56.375 51.855 56.375 52.587V55.4142L62.2104 51.4837C62.612 51.2106 63.1343 51.1867 63.557 51.4174C63.9848 51.6482 64.25 52.0963 64.25 52.587V71.1521Z" fill="#375A9C"/>
                        <path d="M120.372 86C118.957 86 117.674 85.6545 116.522 84.9634C115.403 84.2723 114.564 83.3015 114.004 82.0509L98.9977 47.6938C98.6028 46.8053 98.4054 45.9167 98.4054 45.0282C98.4054 44.1725 98.5699 43.3498 98.899 42.56C99.2281 41.7373 99.6888 41.0133 100.281 40.388C100.874 39.7627 101.565 39.2691 102.354 38.9071C103.177 38.5451 104.049 38.3641 104.971 38.3641C106.221 38.3641 107.39 38.7096 108.476 39.4007C109.562 40.0918 110.384 41.0462 110.944 42.2638L120.027 63.9344L129.06 42.3132C129.554 41.1284 130.344 40.1905 131.43 39.4994C132.516 38.7754 133.7 38.4134 134.984 38.4134C136.86 38.4134 138.439 39.0881 139.723 40.4374C140.315 41.0626 140.776 41.7702 141.105 42.56C141.434 43.3498 141.599 44.1561 141.599 44.9788C141.631 45.7686 141.434 46.6901 141.006 47.7432L126.098 82.0509C125.572 83.1698 124.831 84.0913 123.877 84.8153C122.923 85.5393 121.754 85.9342 120.372 86ZM155.47 34.3656C153.561 34.3656 151.916 33.6745 150.533 32.2923C149.875 31.6342 149.349 30.8773 148.954 30.0216C148.592 29.166 148.411 28.2774 148.411 27.356C148.411 25.4473 149.118 23.7853 150.533 22.3703C151.883 21.021 153.528 20.3463 155.47 20.3463C156.424 20.3463 157.329 20.5273 158.185 20.8893C159.04 21.2184 159.797 21.7121 160.455 22.3703C161.838 23.7524 162.529 25.4143 162.529 27.356C162.529 29.2647 161.838 30.9102 160.455 32.2923C159.797 32.9505 159.04 33.4606 158.185 33.8226C157.329 34.1846 156.424 34.3656 155.47 34.3656ZM155.47 86.543C154.581 86.543 153.726 86.362 152.903 86C152.113 85.6709 151.422 85.2102 150.83 84.6178C150.204 84.0255 149.711 83.3344 149.349 82.5445C148.987 81.7218 148.806 80.8826 148.806 80.027V44.8801C148.806 44.0244 148.987 43.2017 149.349 42.4119C149.711 41.5892 150.204 40.8816 150.83 40.2893C151.422 39.6969 152.129 39.2362 152.952 38.9071C153.808 38.5451 154.68 38.3641 155.568 38.3641C156.424 38.3641 157.247 38.5451 158.037 38.9071C158.859 39.2362 159.567 39.6969 160.159 40.2893C160.752 40.8816 161.196 41.5727 161.492 42.3625C161.821 43.1524 161.986 43.9915 161.986 44.8801V80.027C161.986 80.8826 161.805 81.7218 161.443 82.5445C161.114 83.3344 160.653 84.0255 160.061 84.6178C159.468 85.2102 158.777 85.6709 157.987 86C157.197 86.362 156.358 86.543 155.47 86.543ZM194.023 86.543C190.633 86.543 187.441 85.9506 184.446 84.7659C181.484 83.5483 178.868 81.8535 176.597 79.6815C174.327 77.4765 172.55 74.9096 171.266 71.9807C169.983 69.0518 169.341 65.9419 169.341 62.651C169.341 59.3272 169.983 56.1844 171.266 53.2225C172.55 50.2278 174.327 47.6115 176.597 45.3737C178.868 43.1688 181.501 41.4575 184.496 40.2399C187.523 38.9894 190.699 38.3641 194.023 38.3641C197.314 38.3641 200.391 38.9235 203.254 40.0424C206.117 41.1284 208.585 42.741 210.658 44.8801C211.415 45.6699 211.991 46.542 212.386 47.4964C212.814 48.4507 213.028 49.4051 213.028 50.3594C213.028 52.1694 212.238 53.7491 210.658 55.0984C210 55.6578 209.293 56.0856 208.536 56.3818C207.779 56.678 207.088 56.8261 206.462 56.8261C205.409 56.8261 204.438 56.5957 203.55 56.135C202.661 55.6743 201.641 54.9832 200.489 54.0617C199.37 53.2061 198.252 52.6137 197.133 52.2846C196.047 51.9226 194.895 51.7416 193.677 51.7416C192.163 51.7416 190.732 52.0378 189.383 52.6302C188.066 53.1896 186.914 53.9794 185.927 54.9996C184.94 55.9869 184.166 57.1387 183.607 58.4551C183.08 59.7385 182.817 61.0878 182.817 62.5029C182.817 63.7534 183.064 65.004 183.558 66.2545C184.051 67.5051 184.742 68.6404 185.631 69.6606C186.585 70.7466 187.671 71.6023 188.889 72.2275C190.107 72.8528 191.406 73.1819 192.789 73.2148H193.282C193.381 73.2477 193.529 73.2642 193.727 73.2642C194.977 73.2642 196.129 73.0832 197.182 72.7212C198.268 72.3592 199.37 71.7504 200.489 70.8947C201.575 70.0062 202.563 69.3315 203.451 68.8708C204.34 68.4101 205.311 68.1797 206.364 68.1797C207.022 68.1797 207.729 68.3278 208.486 68.624C209.243 68.8873 209.951 69.2986 210.609 69.8581C212.189 71.2074 212.978 72.8035 212.978 74.6464C212.978 75.6007 212.781 76.5551 212.386 77.5095C211.991 78.4309 211.415 79.2701 210.658 80.027C208.585 82.1661 206.1 83.7951 203.204 84.914C200.341 86 197.281 86.543 194.023 86.543ZM242.004 86.543C238.746 86.543 235.653 85.9342 232.724 84.7165C229.828 83.466 227.261 81.7218 225.023 79.484C222.785 77.2791 221.041 74.7122 219.791 71.7833C218.54 68.8544 217.915 65.7609 217.915 62.5029C217.915 59.2449 218.54 56.1514 219.791 53.2225C221.041 50.2607 222.785 47.6609 225.023 45.4231C227.261 43.1853 229.828 41.4575 232.724 40.2399C235.653 38.9894 238.746 38.3641 242.004 38.3641C245.262 38.3641 248.356 38.9894 251.285 40.2399C254.246 41.4904 256.83 43.2182 259.035 45.4231C261.24 47.6609 262.967 50.2607 264.218 53.2225C265.468 56.1514 266.094 59.2449 266.094 62.5029C266.094 65.7609 265.468 68.8544 264.218 71.7833C263 74.6793 261.272 77.2462 259.035 79.484C256.83 81.6889 254.246 83.4166 251.285 84.6672C248.356 85.9177 245.262 86.543 242.004 86.543ZM242.004 73.3629C243.485 73.3629 244.9 73.0832 246.249 72.5237C247.599 71.9643 248.767 71.1909 249.754 70.2036C250.774 69.1834 251.564 68.0152 252.124 66.6988C252.683 65.3824 252.963 63.9838 252.963 62.5029C252.963 61.022 252.683 59.6234 252.124 58.307C251.564 56.9906 250.774 55.8224 249.754 54.8022C248.767 53.8149 247.599 53.0415 246.249 52.4821C244.9 51.9226 243.485 51.6429 242.004 51.6429C240.556 51.6429 239.158 51.9226 237.808 52.4821C236.492 53.0415 235.34 53.8149 234.353 54.8022C233.333 55.8224 232.526 56.9906 231.934 58.307C231.375 59.6234 231.095 61.022 231.095 62.5029C231.095 63.9838 231.375 65.3824 231.934 66.6988C232.526 68.0152 233.333 69.1834 234.353 70.2036C235.34 71.1909 236.492 71.9643 237.808 72.5237C239.158 73.0832 240.556 73.3629 242.004 73.3629ZM277.892 86C277.003 86 276.147 85.8355 275.325 85.5064C274.502 85.1773 273.778 84.7165 273.153 84.1242C271.803 82.8736 271.129 81.3598 271.129 79.5827V61.8118C271.129 58.6525 271.738 55.6414 272.955 52.7783C274.173 49.9152 275.868 47.3976 278.04 45.2256C280.212 43.0536 282.713 41.3753 285.543 40.1905C288.373 38.9729 291.368 38.3641 294.527 38.3641C297.719 38.3641 300.763 38.9729 303.659 40.1905C306.588 41.3753 309.172 43.0536 311.41 45.2256C313.647 47.3976 315.392 49.9152 316.642 52.7783C317.926 55.6414 318.567 58.6525 318.567 61.8118V79.5827C318.567 81.3927 317.958 82.9065 316.741 84.1242C316.148 84.7165 315.457 85.1773 314.668 85.5064C313.878 85.8355 313.039 86 312.15 86C311.229 86 310.356 85.8355 309.534 85.5064C308.744 85.1773 308.053 84.7165 307.46 84.1242C306.144 82.9065 305.486 81.3927 305.486 79.5827V61.8612C305.453 60.479 305.14 59.1626 304.548 57.9121C303.956 56.6286 303.133 55.5097 302.08 54.5554C301.06 53.601 299.891 52.8605 298.575 52.334C297.259 51.8074 295.909 51.5442 294.527 51.5442C293.145 51.5442 291.829 51.8074 290.578 52.334C289.327 52.8276 288.258 53.5187 287.369 54.4073C286.448 55.3287 285.707 56.4147 285.148 57.6653C284.621 58.8829 284.342 60.1828 284.309 61.565V79.5827C284.309 81.4256 283.684 82.9395 282.433 84.1242C281.182 85.3747 279.669 86 277.892 86Z" fill="#375A9C"/>
                    </svg>
                </div>
                <div className="authorization__text">Современная система для совместной работы</div>
                <div className="authorization__title">Войти в систему</div>
                <div className="authorization__form">
                    <Box className="authorizationRow">
                        {/* {confirm ? confirmBox : authorizationBox} */}
                        {authorizationBox}
                    </Box>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    phone: state.auth.phone,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    authByPhoneAction: (phone: string) => dispatch(actions.auth.authByPhoneAction(phone)),
    getMessageAction: (message: string, result: string) => dispatch(actions.auth.getMessageAction(message, result)),
    phonePinConfirmAction: (payload: PhonePinConfirm) => dispatch(actions.auth.phonePinConfirmAction(payload)),
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Authorization);
// interface TextMaskCustomProps {
//     inputRef: (ref: HTMLInputElement | null) => void;
// }

// function TextMaskCustom(props: TextMaskCustomProps) {
// const { inputRef, ...other } = props;

// return (
//     <MaskedInput
//         {...other}
//         ref={(ref: any) => {
//             inputRef(ref ? ref.inputElement : null);
//         }}
//         mask={['+', /[1-9]/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ' , /\d/, /\d/]}
//         guide={false}
//         showMask
//         />
//     );
// }