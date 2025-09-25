import { Box } from '@mui/material';
import dogHouse from '../../../images/dog-house.png';

export default function AppLogo(sx){

    return (
        <Box className="App-logo" sx={{height: { xs: '28px', md: '40px' }}}>
            <Box component="img" sx={{height: '100%'}} src={dogHouse} alt="App logo: A dog house with a figure of a pawn inside"/>
        </Box>
    );
}