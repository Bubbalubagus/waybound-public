import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Button } from "@/components/ui/button";

export default function StepNavigation({ isValid, backPath, nextPath }) {
    return (
        <div className="flex justify-between">
            <Link href={backPath}>
                <Button 
                    variant="outline" type="button" size="lg"
                    className={`mt-8 text-md`}
                >
                    <ArrowLeft className="w-4 mr-2" />
                    back
                </Button>
            </Link>
            <Link href={nextPath} onClick={(e) => (isValid ? null : e.preventDefault())}>
                <Button 
                    variant="blue" type="button" size="lg"
                    className={`mt-8 text-md ${!isValid && 'opacity-50 cursor-not-allowed'}`}
                >
                    Next
                    <ArrowRight className="w-4 ml-2" />
                </Button>
            </Link>
        </div>
    )
}