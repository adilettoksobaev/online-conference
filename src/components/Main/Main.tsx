import React from 'react'
import { Box, Tabs, Tab, Link  } from '@material-ui/core';
import Laptop from '../../img/laptop.png';
import { PlayIcon, HandIcon, MonitorIcon } from '../../icons/icons';
import './Main.scss'

const Main = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box className="content">
            <div className="main">
                <div className="title">Добро пожаловать в Vicon</div>
                <div className="convenience">
                    <div className="convenience__title">Удобство использования</div>
                    <p>В Vicon всё работает так, чтобы вам было удобно: начиная с общения с Siri и простых, интуитивно понятных жестов управления и заканчивая удобным поиском файлов, автоматическими обновлениями и многим другим. Какую бы задачу вам ни пришлось решать в Vicon, вам не понадобится тратить время на обучение, и вы сможете быстрее добиться нужного результата.</p>
                </div>
                <div className="laptop">
                    <img src={Laptop} alt="Ноутбук"/>
                </div>
                <div className="tabs">
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Конференции"/>
                        <Tab label="Материалы" />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <p>В Vicon всё работает так, чтобы вам было удобно: начиная с общения с Siri и простых, интуитивно понятных жестов управления и заканчивая удобным поиском файлов, автоматическими обновлениями и многим другим. Какую бы задачу вам ни пришлось решать в Vicon, вам не понадобится тратить время на обучение, и вы сможете быстрее добиться нужного результата.</p>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <p>В Vicon всё работает так, чтобы вам было удобно: начиная с общения с Siri и простых, интуитивно понятных жестов управления и заканчивая удобным поиском файлов, автоматическими обновлениями и многим другим. Какую бы задачу вам ни пришлось решать в Vicon, вам не понадобится тратить время на обучение, и вы сможете быстрее добиться нужного результата.</p>
                    </TabPanel>
                </div>
            </div>
            <div className="mainBottom">
                <div className="title">Конференции</div>
                <div className="mainBottom__item">
                    <div className="mainBottom__icon"><PlayIcon /></div>
                    <p>В Vicon всё работает так, чтобы вам было удобно: начиная с общения с Siri и простых, интуитивно понятных жестов управления и заканчивая удобным поиском файлов, автоматическими обновлениями и многим другим. Какую бы задачу вам ни пришлось решать в Vicon, вам не понадобится тратить время на обучение, и вы сможете быстрее добиться нужного результата.</p>
                </div>
                <div className="mainBottom__item">
                    <div className="mainBottom__icon"><HandIcon /></div>
                    <p>В Vicon всё работает так, чтобы вам было удобно: начиная с общения с Siri и простых, интуитивно понятных жестов управления и заканчивая удобным поиском файлов, автоматическими обновлениями и многим другим.</p>
                </div>
                <div className="mainBottom__item">
                    <div className="mainBottom__icon"><MonitorIcon /></div>
                    <p>В Vicon всё работает так, чтобы вам было удобно: начиная с общения с Siri и простых, интуитивно понятных жестов управления и заканчивая удобным поиском файлов, автоматическими обновлениями и многим другим.</p>
                </div>
                <div className="bottom">
                    <p>Смотрите все запланированние конференции</p>
                    <div><Link href="#">Чтобы войти в конференцию - просто нажмите на карточку с названием мероприятия</Link></div>
                    <div className="hand"><Link href="#">Чтобы попросить слово во время конференции, нажмитие значок “Рука”</Link><span><HandIcon /></span></div>
                </div>
            </div>
        </Box>
    )
}

export default Main;

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            hidden={value !== index}
            {...other} >
            {value === index && <Box>{children}</Box>}
        </Box>
    );
}