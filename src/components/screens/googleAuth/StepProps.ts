export interface StepContentProps {
  onBack: () => void;
  onNext: () => void;
  backupCode?: string;
  updateBackupCode?: Function;
}
