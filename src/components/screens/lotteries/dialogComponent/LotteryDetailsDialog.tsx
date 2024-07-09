import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface LotteryDetailsDialogProps {
    props: {
        open: boolean;
        handleClose: () => void;
        dialogTitle: string;
        dialogContent: () => JSX.Element;
    }
}

export default function LotteryDetailsDialog({ props }: LotteryDetailsDialogProps) {
    const { open, handleClose, dialogTitle, dialogContent: DialogContentComponent } = props;

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <DialogContentComponent />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}