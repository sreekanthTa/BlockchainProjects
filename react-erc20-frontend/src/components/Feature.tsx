import { Box, useColorModeValue, VStack, Icon, Heading, Text } from '@chakra-ui/react'

interface FeatureProps {
  title: string;
  text: string;
  icon: any;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      p={6}
      rounded="xl"
      shadow="base"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
    >
      <VStack spacing={4}>
        <Icon as={icon} w={10} h={10} color="blue.500" />
        <Heading size="md">{title}</Heading>
        <Text color="gray.500" align="center">{text}</Text>
      </VStack>
    </Box>
  )
}

export default Feature