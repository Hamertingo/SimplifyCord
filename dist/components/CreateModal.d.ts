import { ModalBuilder, TextInputStyle } from "discord.js";
type ModalInputOptions = {
    label: string;
    customId: string;
    style?: TextInputStyle;
    value?: string;
    required?: boolean;
    placeholder?: string;
};
type ModalData = {
    title: string;
    inputs: ModalInputOptions[];
    customId: string;
};
declare class CustomModalBuilder extends ModalBuilder {
    show(interaction: any): void;
}
declare const CreateModal: (modalData: ModalData) => CustomModalBuilder;
export default CreateModal;
