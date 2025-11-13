import "@mui/material/styles";

// 1️⃣ Extend the palette so theme.palette.green works
declare module "@mui/material/styles" {
    interface Palette {
        green: Palette["primary"];
        grey: Palette["primary"];
        red: Palette["primary"]
    }

    interface PaletteOptions {
        green?: PaletteOptions["primary"];
        grey?: PaletteOptions["primary"];
        red?: PaletteOptions["primary"];
    }
}

// 2️⃣ Allow <Button color="green" />
declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        green: true;
        grey: true;
        red: true;
    }
}
