// Requirements
import { Component } from 'react';
import {
    Button, Callout, Container, Flex, Text,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useLanguage } from '../language';


// Internal
class ErrorBoundaryInner extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('UI error boundary', error, info.componentStack);
    }

    retry = () => {
        this.setState({ error: null });
    };

    render() {
        const { error } = this.state;
        const { children, title, message, retryLabel } = this.props;

        if (error) {
            return (
                <Container size="2">
                    <Flex direction="column" gap="3" py="6">
                        <Callout.Root color="red">
                            <Callout.Icon>
                                <InfoCircledIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                <Flex direction="column" gap="1">
                                    <Text weight="medium">
                                        { title }
                                    </Text>
                                    <Text size="2">
                                        { message }
                                    </Text>
                                </Flex>
                            </Callout.Text>
                        </Callout.Root>
                        <Button variant="soft" onClick={this.retry}>
                            { retryLabel }
                        </Button>
                    </Flex>
                </Container>
            );
        }

        return children;
    }
}


// Exported
export const StructureErrorBoundary = ({ children }) => {
    const { t } = useLanguage();

    return (
        <ErrorBoundaryInner
            title={t('Something went wrong')}
            message={t('An unexpected error occurred. You can try again or navigate elsewhere.')}
            retryLabel={t('Try again')}
        >
            {children}
        </ErrorBoundaryInner>
    );
};
